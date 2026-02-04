# Moltbot (Clawdbot) 프로젝트 상세 구조 분석

이 문서는 Moltbot 프로젝트의 전체 구조를 상세히 분석한 보고서입니다. 각 구성 요소별로 사용된 기술, 핵심 코드 예제, 테스트 예제, 그리고 설명을 포함합니다.

---

## 1. 구성 요소 상세 분석 목록

### 1.1. Gateway Server (중추 서버)

*   **사용된 기술**: Node.js, TypeScript, WebSocket (`ws`), Hono (HTTP wrapper), SQLite (implied for state), NodeRegistry (Custom P2P-like registry).
*   **설명**:
    Gateway는 전체 시스템의 심장부로, 사용자와 에이전트, 그리고 다양한 플랫폼(채널)을 연결하는 허브 역할을 합니다. WebSocket을 통해 클라이언트와 실시간으로 통신하며, 플러그인 시스템을 통해 기능을 확장합니다. `server.impl.ts`에서 서버 생명주기 관리, 채널 관리, 에이전트 실행 컨텍스트 관리 등을 수행합니다. 특히 `NodeRegistry`를 통해 연결된 기기나 노드들을 관리하는 분산 네트워크 구조를 가집니다.
*   **핵심 코드 (개념적)**:
    ```typescript
    // src/gateway/server.impl.ts (발췌)
    export async function startGatewayServer(port = 18789, opts: GatewayServerOptions = {}) {
      // 설정 로드 및 초기화
      const cfgAtStart = loadConfig();
      
      // Node Registry 초기화 (기기 관리)
      const nodeRegistry = new NodeRegistry();
      
      // WebSocket 및 HTTP 핸들러 부착
      attachGatewayWsHandlers({
        wss,
        port,
        events: GATEWAY_EVENTS,
        logGateway: log,
        // ... 컨텍스트 주입
      });

      // Gateway 반환 (종료 핸들러 포함)
      return {
        close: async (opts) => { /* ... */ },
      };
    }
    ```
*   **테스트용 예제 코드**:
    ```typescript
    // src/gateway/gateway.e2e.test.ts (발췌)
    it("runs a mock OpenAI tool call end-to-end", async () => {
      // 1. 게이트웨이 서버 시작
      const port = await getFreeGatewayPort();
      const server = await startGatewayServer(port, { bind: "loopback", auth: { token } });

      // 2. 클라이언트 연결
      const client = await connectGatewayClient({ url: `ws://127.0.0.1:${port}`, token });

      // 3. 요청 전송 및 결과 검증
      const payload = await client.request("agent", {
        sessionKey: "agent:dev:mock-openai",
        message: "Call the read tool...",
      });
      expect(payload?.status).toBe("ok");
    });
    ```

### 1.2. AI Agent System (지능형 에이전트)

*   **사용된 기술**: Large Language Models (OpenAI, Anthropic 등), Prompt Engineering, Sub-agent Architecture, Sandbox/Docker.
*   **설명**:
    AI 에이전트는 사용자의 메시지를 이해하고 작업을 수행하는 로직입니다. `pi-embedded-runner.ts`가 에이전트 실행을 담당하며, `system-prompt.ts`에서 에이전트에게 부여할 역할(페르소나)과 도구(Tools) 사용법을 정의합니다. 복잡한 작업은 서브 에이전트(Sub-agents)에게 위임할 수 있는 계층적 구조를 가지고 있으며, 샌드박스 환경에서 실행되어 보안을 유지합니다. 에이전트는 "생각(Thinking)" 과정을 거쳐 최종 답변을 생성하는 Chain-of-Thought 방식을 지원합니다.
*   **핵심 코드 (개념적)**:
    ```typescript
    // src/agents/system-prompt.ts (발췌)
    export function buildAgentSystemPrompt(params: { workspaceDir: string; ... }) {
      return [
        "You are a personal assistant running inside Clawdbot.",
        "## Tooling",
        "Tool availability: ...",
        "- read: Read file contents",
        "- exec: Run shell commands",
        // ... 도구 목록 및 사용법 주입
      ].join("\n");
    }
    ```
*   **테스트용 예제 코드**:
    (Gateway E2E 테스트 내에서 에이전트 응답을 검증하는 방식으로 테스트함)
    ```typescript
    // 에이전트에게 도구 사용 명령
    const payload = await client.request("agent", {
        message: 'Call the read tool on "test.txt".',
    });
    // 에이전트가 도구를 호출했는지 결과 확인
    const text = extractPayloadText(payload?.result);
    expect(text).toContain("nonceA"); 
    ```

### 1.3. User Interface (웹 제어판)

*   **사용된 기술**: Lit (Web Components), Vite, TypeScript, CSS Variables.
*   **설명**:
    사용자가 브라우저를 통해 봇의 상태를 확인하고 제어할 수 있는 "Control UI"입니다. Lit 라이브러리를 사용하여 가벼운 웹 컴포넌트 기반으로 구축되었으며, `/ui` 디렉토리에서 독자적으로 빌드됩니다. Gateway 서버가 이 정적 파일들을 서빙합니다. 채팅 인터페이스, 설정 관리, 로그 확인 등의 기능을 제공하며, WebSocket을 통해 Gateway와 실시간 데이터를 주고받습니다.
*   **핵심 코드 (개념적)**:
    ```typescript
    // ui/src/main.ts -> ui/src/ui/app.ts (추정 구조)
    import { LitElement, html, css } from "lit";
    import { customElement } from "lit/decorators.js";

    @customElement("clawd-app")
    export class ClawdApp extends LitElement {
      render() {
        return html`
          <div class="app-container">
            <app-sidebar></app-sidebar>
            <main>
              <app-chat-view></app-chat-view>
            </main>
          </div>
        `;
      }
    }
    ```

### 1.4. Channels & Clients (연결 및 확장)

*   **사용된 기술**: Baileys (WhatsApp), Slack Bolt, Swift (iOS/macOS), Kotlin (Android).
*   **설명**:
    Moltbot은 다양한 플랫폼과 연결됩니다. `src/channels` 하위의 모듈들은 각 메신저 플랫폼(WhatsApp, Slack 등)의 API를 추상화하여 Gateway가 이를 통합 관리할 수 있게 합니다. 또한 `apps/` 디렉토리에는 iOS, Android, macOS용 네이티브 클라이언트 앱 소스가 포함되어 있어, 모바일 환경에서도 봇을 제어하거나 알림을 받을 수 있습니다.

---

## 2. 결론: 전체 프로세스 체인 구조 (Process Chain Analysis)

Moltbot의 전체 작동 과정은 **"입력 -> 라우팅 -> 추론 -> 실행 -> 응답"**의 순환 구조를 가집니다.

1.  **입력 단계 (Input & Routing)**:
    사용자가 WhatsApp이나 Slack 등 **채널 Client**를 통해 메시지를 보냅니다. 이 메시지는 해당 채널의 어댑터(`src/channels/*`)를 통해 **Gateway Server**로 유입됩니다. Gateway는 이 메시지의 세션 키를 분석하여 어떤 에이전트 세션에 속하는지 식별합니다.

2.  **전처리 및 컨텍스트 로드**:
    Gateway는 메시지를 **NodeRegistry**나 메모리에서 해당 세션의 이전 대화 기록(Context)과 함께 로드합니다. 이때 **시스템 프롬프트(`system-prompt.ts`)**가 동적으로 생성되어 에이전트에게 현재 시간, 사용 가능한 도구, 작업 환경(Workspace) 정보를 주입합니다.

3.  **지능형 추론 (AI Inference)**:
    준비된 컨텍스트는 **Agent Runner(`pi-embedded-runner.ts`)**에 의해 LLM(OpenAI/Anthropic 등)으로 전송됩니다. LLM은 사용자의 의도를 분석하고, 답변을 바로 할지 아니면 도구(Tool)를 사용할지 결정합니다. 내부적으로 `<think>` 태그를 사용해 추론 과정을 거칩니다.

4.  **도구 실행 (Tool Execution & Sandbox)**:
    에이전트가 도구 사용(예: `exec`, `read_file`)을 요청하면, Gateway는 이를 가로채어 보안 **Sandbox** 환경 내에서 실행합니다. 실행 결과(파일 내용, 명령어 출력 등)는 다시 에이전트의 컨텍스트로 주입됩니다. 필요시 서브 에이전트를 생성하여 작업을 위임하기도 합니다.

5.  **응답 생성 및 전달 (Response & Output)**:
    도구 실행 결과를 바탕으로 에이전트가 최종 답변을 생성합니다. 이 답변은 다시 Gateway를 거쳐 최초 요청이 들어온 채널 어댑터로 전달되고, 최종적으로 사용자의 메신저 앱에 텍스트나 알림 형태로 표시됩니다. 동시에 **Control UI**에도 이 대화 내용이 실시간으로 업데이트되어 관리자가 모니터링할 수 있습니다.

이 모든 과정은 **WebSocket**과 **Event Emitter** 기반의 비동기 이벤트 루프 위에서 작동하여, 높은 실시간성과 확장성을 보장합니다.
