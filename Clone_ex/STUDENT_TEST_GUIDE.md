# 🎓 OpenClaw Clone_ex: 학생용 테스트 및 학습 가이드

이 문서는 우리가 구현한 `Clone_ex` 프로젝트의 작동 원리를 직접 확인하고, 소스 코드를 분석하며 시스템의 **'해부학적 구조(Anatomy)'**를 깊이 있게 이해하기 위해 작성되었습니다.

---

## 🧪 테스트 목표
1.  **시뮬레이션**을 통해 시스템이 유기적으로 살아 움직이는 과정을 확인합니다.
2.  **로그(Log)**를 분석하여 데이터가 어떤 **'프로세스 - 장기'**를 거쳐가는지 추적하는 능력을 배양합니다.
3.  **코드**를 직접 수정해 보며 시스템의 반응을 통해 설계자의 의도를 파악합니다.

---

## 🚀 Step 1: 시스템 가동 (The Big Bang)

가상 시스템 전체가 어떻게 연결되어 작동하는지 직접 구동해 보시기 바랍니다.

1.  VS Code 하단의 **터미널(Terminal)**을 엽니다.
2.  아래 명령어를 입력하여 시뮬레이션을 실행합니다.
    ```bash
    cd Clone_ex
    node interactive_run_ex.js
    ```

    > **💡 잠깐! 시뮬레이션 코드는 어떻게 만드나요?**
    >
    > 코드를 완성한 뒤, 전체 흐름을 테스트하기 위해 AI(몰트봇)에게 **시뮬레이션 코드** 작성을 요청하는 방법을 익혀 두십시오. 실제 환경(예: WhatsApp 연동)을 꾸리기 전에 핵심 로직만 검증할 때 매우 유용합니다.
    >
    > **[AI 프롬프트 작성 공식]**
    > 1. **목적 선언**: "지금까지 작성한 전체 코드가 유기적으로 동작하는지 터미널에서 확인하고 싶어."
    > 2. **조건 명시 (가상화)**: "실제 외부 연결(WhatsApp, HTTP 포트 바인딩 등)은 모두 `console.log`나 `setTimeout`으로 가상화(Mocking) 처리해 줘."
    > 3. **단계별 출력 요구**: "초기화 -> 메시지 수신 -> 분석 -> 응답 등 전체 과정을 Step별로 보기 좋게 출력하는 하나의 실행 파일(`interactive_run.js`)을 만들어 줘."
3.  **관찰 및 분석 포인트**:
    - 터미널에 출력되는 **[STEP 1] 기초 공사 및 신경망 초기화** 로그에서 어떤 신경망이 초기화되는지 확인하십시오. (힌트: `EventEmitter`)
    - 터미널에 출력되는 **[STEP 5] 브레인 가동** 단계에서 AI가 대화를 이해할 때 발생하는 로그의 흐름을 분석해 보시기 바랍니다.

---

## 🧠 Step 2: 뇌와 오감의 연결 구조 확인 (Anatomical Study)

코드를 직접 열어 우리가 정의한 '해부학적 역할'이 실제 구현과 어떻게 일치하는지 대조해 보시기 바랍니다.

| 확인할 파일 | 해부학적 역할 | 분석 포인트 (Focus) |
| :--- | :--- | :--- |
| `src/gateway/server.impl.ts` | **뇌 (Brain)** | `gateway.on("incoming_message", ...)` 로직이 메시지 수신 시 어떻게 반응하는지 파악하십시오. |
| `src/narrator.ts` | **신경망 (Nerve)** | `narrate` 함수가 시스템 전반의 정보를 어떻게 포맷팅하여 출력을 표준화하는지 연구하십시오. |
| `src/agents/pi-embedded-runner.ts` | **지능 (Intelligence)** | `runAgent` 함수 내에서 AI의 답변 생성 로직이 어떻게 구성되어 있는지 추론해 보시기 바랍니다. |

### 1. 뇌 (Brain) - `src/gateway/server.impl.ts`
> **분석 포인트**: `gateway.on("incoming_message", ...)` 로직이 메시지 수신 시 어떻게 반응하는지 파악하십시오.

```typescript
import { narrate } from "../narrator.js";
import { runAgent } from "../agents/pi-embedded-runner.js";
import EventEmitter from "events";

// ... (생략)

export async function startGatewayServer() {
  // 1. 게이트웨이 이벤트 허브 생성 (신경 중추)
  const gateway = new EventEmitter();

  // ... (중략)

  // [신경망 핵심] 메시지 유입 시 AI 에이전트 실행 로직
  gateway.on("incoming_message", async (msg: any) => {
    narrate({ 
      who: "Brain", 
      role: "지휘소", 
      action: "WhatsApp 메시지 수신 -> AI 분석 의뢰", 
      friend: msg.from 
    });

    // AI 에이전트 실행 (지능에게 판단 의뢰)
    const reply = await runAgent(msg.text);

    // AI의 답변을 다시 WhatsApp으로 전송 (팔다리에게 명령)
    await whatsapp.sendMessage(msg.from, reply);
  });
}
```

### 2. 신경망 (Nerve) - `src/narrator.ts`
> **분석 포인트**: `narrate` 함수가 시스템 전반의 정보를 어떻게 포맷팅하여 출력을 표준화하는지 연구하십시오.

```typescript
import fs from 'fs';

// "해설자" 함수: 시스템의 모든 움직임을 기록합니다.
export function narrate(info: {
  who: string;      // 함수 이름
  role: string;     // 역할
  action: string;   // 하는 일
  friend?: string;  // 연결 대상
}) {
  const logMessage = `[${new Date().toISOString()}] 
  👤 WHO: ${info.who}
  🛡️ ROLE: ${info.role}
  🎬 ACTION: ${info.action}
  ${info.friend ? `🔗 CONTACT: ${info.friend}` : ""}
  --------------------------------------------------\n`;

  // 1. 화면(Terminal)에 실시간 출력
  console.log(logMessage);
  
  // 2. 파일(learning.log)에 영구 기록
  try {
    fs.appendFileSync('learning.log', logMessage);
  } catch (err) {
    console.error('Failed to write to learning.log:', err);
  }
}
```

### 3. 지능 (Intelligence) - `src/agents/pi-embedded-runner.ts`
> **분석 포인트**: `runAgent` 함수 내에서 AI의 답변 생성 로직이 어떻게 구성되어 있는지 추론해 보시기 바랍니다.

```typescript
import { narrate } from "../narrator.js";

/**
 * AI 에이전트 실행기: 사용자의 입력을 이해하고 답변을 생성합니다.
 */
export async function runAgent(userInput: string) {
  narrate({ 
    who: "runAgent", 
    role: "지능형 뇌 (AI Agent)", 
    action: "사용자 요청 추론 시작", 
    friend: userInput 
  });

  // 1. [추론 시작] LLM 호출 시뮬레이션
  console.log(`[Agent] Thinking about: "${userInput}"...`);
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  // 2. [행동 판단] 도구 사용 여부 체크
  if (userInput.includes("날씨")) {
    narrate({ who: "Agent", role: "지능", action: "도구 선택: WeatherAPI" });
    const weatherInfo = "서울은 현재 맑음, 기온은 15도입니다.";
    return `요청하신 날씨 정보입니다: ${weatherInfo}`;
  }

  // 3. [일반 응답]
  return "안녕하세요! 저는 몰트봇입니다. 무엇을 도와드릴까요?";
}
```

---

## 🛠 Step 3: 시스템 '신경' 수정 실험 (Experiments)

이론으로 배운 것을 바탕으로 직접 코드를 수정하여 시스템의 변화를 관찰해 보십시오.

### 실험 A: 시스템의 '응답 스타일' 변경
1.  `interactive_run_ex.js` 파일을 엽니다.
2.  `Step 5` 조각에 정의된 `aiReply` 변수의 내용을 본인만의 스타일로 수정합니다.
3.  다시 `node interactive_run_ex.js`를 실행하여 수정된 응답이 정상적으로 출력되는지 확인하십시오.

### 실험 B: 새로운 '신경 로그' 추가
1.  `src/gateway/server-http.ts` 파일을 엽니다.
2.  `app.get("/health", ...)` 핸들러 내에 새로운 `narrate` 로그를 추가해 보십시오. (예: `action: "상태 점검 중"`)
3.  저장 후 시뮬레이션을 다시 구동하여 본인이 추가한 로그가 출력되는지 확인하십시오.

---

## 📋 자가 진단 체크리스트 (Self-Check)

테스트를 마치신 후, 다음 질문에 명확하게 답할 수 있는지 본인의 실력을 점검해 보시기 바랍니다.

- [ ] 메시지 수신 시 가장 먼저 반응하는 **'프로세스 - 장기'**의 명칭과 역할을 이해했습니까?
- [ ] AI 에이전트와 메신저 사이를 연결하는 '중재자'의 개념을 파악했습니까?
- [ ] 터미널에 출력되는 로그 시스템이 전체 아키텍처 이해에 어떤 도움을 주는지 체득했습니까?

---
**Happy Coding!** 기술적 궁금증이 생기면 주저하지 말고 질문하시기 바랍니다. 여러분의 성장을 끝까지 지원하겠습니다. 🚀
