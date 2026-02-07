## Chapter 2. 6대 핵심 부품 조립 (The 6 Components)


Gateway는 단순한 서버가 아닙니다. 모든 데이터(메시지, 명령)가 지나가는 **고속도로이자, 시스템의 중추 신경망**입니다.

### 2-1. 🛑 기초지식: 도대체 "Gateway Server"가 뭔가요? (What is a Gateway Server?)


"그냥 서버라고 하면 되지, 왜 게이트웨이라는 어려운 말을 쓰나요?"

#### 1. 정의 (Definition)
게이트웨이(Gateway)는 직역하면 **"관문"** 입니다. 서로 다른 네트워크나 시스템이 만나는 '통로' 역할을 하는 특수 서버를 말합니다. 우리 프로젝트에서 Gateway는 **"외부 메신저(WhatsApp 등)와 내부 AI 에이전트 사이의 중계실"** 입니다.

#### 2. 은유 (Metaphor): "인천 공항의 입출국 심사대"
*   **외부 세상**: 미국, 중국, 일본 등 언어와 규격이 다른 여러 나라 (WhatsApp, Slack, Telegram...)
*   **공항 (Gateway)**: 모든 손님은 일단 공항으로 들어옵니다. 여기서 여권을 검사하고, 공통된 서류(표준 데이터)를 작성합니다.
*   **내부 도시 (AI Brain)**: 공항을 통과한 손님은 이제 '대한민국 표준 법규'를 따릅니다. AI는 손님이 어느 나라에서 왔든 상관없이, 공항에서 처리해준 **표준 양식**만 보고 대화하면 됩니다.

#### 3. 핵심 역할 (Key Roles)
1.  **언어 통일 (Normalization)**: WhatsApp의 복잡한 데이터를 AI가 알아듣기 쉬운 깔끔한 텍스트로 바꿔줍니다.
2.  **보안 검문 (Security)**: 이상한 명령이나 해킹 시도가 없는지 입구에서 컷(Cut)합니다.
3.  **교통 정리 (Routing)**: 질문은 AI에게 보내고, 설정 변경은 데이터베이스로 보내는 등 업무를 배분합니다.

---


### 2-2. [설계 철학] 왜 굳이 "Gateway" 구조를 선택했는가? (Developer's Intent)


개발자가 단순히 API 서버를 만들지 않고 `Gateway` 패턴을 도입한 데에는 명확한 **건축학적 의도(Architectural Intent)** 가 있습니다.

1.  **추상화와 통일 (The Universal Translator)**:
    *   **문제**: WhatsApp은 `JID`를 쓰고, Slack은 `channel_id`를 쓰고, Telegram은 `chat_id`를 씁니다. 메시지 포맷도 제각각(JSON 구조 상이)입니다. 에이전트(LLM)가 이 모든 차이를 알게 하면 코드가 지옥이 됩니다.
    *   **해결**: Gateway는 들어오는 모든 요청을 **"표준화된 내부 이벤트(Normalized Events)"** 로 변환합니다. 에이전트는 상대방이 WhatsApp인지 슬랙인지 알 필요 없이 오직 **"메시지가 왔다"** 는 사실만 처리하면 됩니다.

    > [!NOTE]
    > **🎓 개념 수업: 추상화(Abstraction)가 도대체 무슨 말인가요?**
    >
    > "추상화"라는 말이 어렵게 느껴지시나요? 사실 우리는 태어날 때부터 추상화를 하며 살고 있습니다.
    >
    > **1. 정의 (Definition)**
    > *   **사전적 의미**: 중요한 특징만 남기고, 불필요한 세부 사항을 지우는 것.
    > *   **코딩적 의미**: **"복잡한 내부 원리는 숨기고, 단순한 사용법(버튼)만 노출하는 것"**
    >
    > **2. 은유 (Metaphor): 자동차 운전**
    > *   **구체화 (Anti-Abstraction)**: 엑셀을 밟을 때마다 "연료 밸브를 30도 열고, 공기 흡입량을 10% 늘리고, 스파크 플러그를 점화해라"라고 직접 기계 조작을 해야 한다면? 아무도 운전을 못 할 겁니다.
    > *   **추상화 (Abstraction)**: 그냥 **"오른쪽 페달을 밟으면 -> 앞으로 간다"** 라는 사실만 알면 됩니다. 내부 엔진이 휘발유인지 전기인지는 몰라도 됩니다. 이 "페달"이 바로 추상화의 결과물입니다.
    >
    > **3. 코드 예시 (Code Example)**
    > *   **나쁜 코드 (구체적)**: 커피 타는 과정을 일일이 다 적음.
    >     ```javascript
    >     // 물 끓이기
    >     water.temperature = 100;
    >     // 원두 갈기
    >     beans.grind();
    >     // 내리기
    >     filter.pour(water);
    >     // 컵에 담기
    >     cup.fill();
    >     ```
    > *   **좋은 코드 (추상화)**: "커피 주세요" 한 마디면 됨.
    >     ```javascript
    >     makeCoffee(); // 끝. (내부에서 무슨 일이 일어나는지는 이 함수를 만든 사람만 알면 됨)
    >     ```
    >
    > **4. 개발자의 지침 (Guideline)**
    > 앞으로 코드를 짤 때 항상 스스로에게 물어보세요.
    > **"내가 만든 이 코드를 쓸 동료(혹은 미래의 나)에게 이 복잡한 과정을 다 설명해야 하나? 아니면 버튼 하나(`startGatewayServer`)만 쥐여주면 되나?"**
    >
    > 버튼 하나만 쥐여주는 것, 그것이 바로 **"추상화를 잘하는 개발자"** 입니다.

2.  **결합도 감소 (Decoupling)**:
    *   **의도**: "뇌(Agent)"와 "입/귀(Channel)"를 완벽하게 분리합니다.
    *   **효과**: 나중에 `Discord` 채널을 추가하고 싶을 때, Gateway에 플러그인만 끼우면 됩니다. 에이전트 코드는 단 한 줄도 수정할 필요가 없습니다. 이것이 **Micro-Kernel 아키텍처**의 핵심입니다.

    > [!TIP]
    > **🎓 개념 수업: Micro-Kernel(마이크로 커널) 아키텍처란?**
    >
    > **"스마트폰과 앱의 관계"** 로 이해하면 가장 완벽합니다.
    >
    > **1. 정의 (Definition)**
    > *   핵심 기능(심장)은 아주 작고 단단하게 유지하고, 나머지 기능들은 **플러그인(부품)** 처럼 끼워 쓰는 방식입니다. 앱스토어 아키텍처라고도 불립니다.
    >
    > **2. 은유 (Metaphor): 멀티탭 (Power Strip)**
    > *   **커널(Kernel)**: 전기가 흐르는 **멀티탭 본체**입니다. (Gateway의 통신 및 이벤트 관리 로직)
    > *   **플러그인(Plug-in)**: 멀티탭에 꽂는 **TV, 냉장고, 충전기**입니다. (WhatsApp 채널, Slack 채널, LLM 엔진 등)
    > *   **Why?**: 냉장고가 고장 났다고 멀티탭 전체를 버리지 않죠? 그냥 냉장고 코드만 고치거나 플러그를 뽑으면 됩니다. 또 새로운 기계(새로운 메신저)가 나와도 멀티탭에 구멍만 있다면 언제든 꽂아서 전기를 쓸 수 있습니다.
    >
    > **3. 장점 (Benefits in OpenClaw)**
    > *   **확장성**: 사용자님이 나중에 "저는 텔레그램도 연결하고 싶어요"라고 할 때, 기존 서버 코드를 건드리지 않고 텔레그램용 **'플러그'**만 하나 더 만들어서 꽂으면 끝납니다.
    > *   **안정성**: 특정 채널(플러그인)에서 에러가 나도, 본체(커널)는 죽지 않고 다른 채널들을 계속 유지할 수 있습니다.
    >
    > **핵심**: 본체는 최대한 가볍게(Micro), 기능은 외부에서(Plugin)! 이것이 OpenClaw가 수많은 메신저를 자유자재로 다루는 비결입니다.


3.  **상태 및 세션 중앙 관리 (Centralized State)**:
    *   LLM은 "기억"이 없습니다. 사용자의 대화 맥락(Context)을 저장하고, 적절한 시점에 잘라서(Pruning) LLM에 넣어주는 **기억 관리자 역할**을 Gateway가 중앙 통제합니다.

#### 2-2-1. [비교 분석] 게이트웨이 말고 다른 방법은 없나요? (Architectural Alternatives)


"꼭 이렇게 복잡하게 해야 하나요? 더 쉬운 방법은 없나요?"

#### 1. 모놀리식 (Monolithic) - "원맨밴드 스타일"
*   **방식**: `server.ts` 파일 하나에 WhatsApp 코드, LLM 코드, 웹사이트 코드를 다 때려 넣는 방식.
*   **은유(Metaphor)**: **북 치고 장구 치는 1인 서커스단**. 혼자서 다 하니까 합을 맞출 필요가 없어 시작은 빠릅니다.
*   **문제점**: "피아노(Discord)"를 추가하려면? 서커스단원 전체가 악기 배우느라 공연을 멈춰야 합니다. 코드가 3,000줄 넘어가면 본인도 못 알아봅니다.

#### 2. 직접 연결 (Point-to-Point) - "칵테일 파티 스타일"
*   **방식**: AI 에이전트가 WhatsApp 서버, Slack 서버, Telegram 서버에 각각 따로따로 말을 거는 방식.
*   **은유(Metaphor)**: **통역사 없는 국제시장**. AI가 독일어(WhatsApp), 영어(Slack), 러시아어(Telegram)를 다 배워야 합니다.
*   **문제점**: 카카오톡 하나 추가할 때마다 AI 뇌수술을 다시 해야 합니다. (유지보수 지옥)

#### 3. 게이트웨이 (Gateway) - "인천공항 스타일" (우리의 선택)
*   **방식**: 모든 손님(메시지)은 일단 공항(Gateway)으로 옵니다. 공항에서 검역(Validation)하고, 표준 비자(Standardized Event)를 발급해서 입국시킵니다.
*   **승리 요인**: AI는 "공항에서 온 손님"만 상대하면 됩니다. 그 손님이 미국에서 왔든 달나라에서 왔든 신경 쓸 필요가 없습니다. 
    > [!IMPORTANT]
    > **이것이 100년 가는 소프트웨어의 비밀입니다.**


### 2-3. Gateway 시스템 구조 및 조립 전략 (Gateway Anatomy)


"파일이 너무 많아요! 어디서부터 건드려야 하죠?"
걱정 마세요. 100개가 넘는 파일 중, **핵심 장기(Core Organs)** 6개만 알면 살아있는 서버를 만들 수 있습니다.

#### 2-3-1. 핵심 파일 구조 (The Skeleton)
```text
src/
├── gateway/
│   ├── server.ts              # [1] 안내 데스크 (Facade)
│   ├── server.impl.ts         # [2] 종합 상황실 (Core)
│   ├── server-http.ts         # [3] 입 (Mouth)
│   ├── server-ws-runtime.ts   # [4] 귀 (Ears)
│   └── server-channels.ts     # [5] 팔다리 (Limbs)
└── narrator.ts                # [6] 해설자 (Narrator)
```

#### 2-3-2. [실습] 디렉토리 및 파일 생성 가이드 (Step-by-Step)

다음으로, 위에서 본 설계도를 바탕으로 직접 VS Code에서 집을 지을 차례입니다. "파일을 어디에 만들어야 하지?"라는 고민을 해결해 드립니다.

1.  **루트 폴더 확인**: `OpenClaw` 프로젝트 최상위 디렉토리에 있는지 확인하세요.
2.  **`src` 폴더 생성**: 최상위 디렉토리에서 대부분의 소스코드가 들어갈 `src` 폴더를 새로 만드세요.
3.  **`gateway` 폴더 생성**: `src` 폴더 안에서 마우스 우클릭 후 `New Folder`를 선택하고 `gateway`라고 입력하세요. (이미 있다면 넘어가셔도 좋습니다.)
4.  **파일 생성 레이스**: 이제 `gateway` 폴더 안에서 아래 파일들을 하나씩 만듭니다.
    *   `server.ts`
    *   `server.impl.ts`
    *   `server-http.ts`
    *   `server-ws-runtime.ts`
    *   `server-channels.ts`
5.  **기타 필수 폴더**: 게이트웨이가 참조할 다른 부위들도 미리 만들어두면 에러 방지에 좋습니다.
    *   `src/infra/`: 심장 박동기(`heartbeat.ts`) 등이 위치할 곳
    *   `src/config/`: 설정 로직이 들어갈 곳

> [!TIP]
> **📂 폴더 구조를 한 눈에 보는 팀**
> VS Code 왼쪽 탐색기에서 폴더를 만들 때, `src/gateway`처럼 슬래시를 사용해서 한 번에 하위 폴더까지 만들 수도 있답니다!

---

### 2-4. [실전 가이드] VS Code에서 6대 핵심 부품 조립하기 (The Assembly Line)

무작정 전체 코드를 복사하면 에러가 100개 넘게 뜹니다. 우리는 **의존성(Dependency)** 순서에 따라, 마치 프라모델을 조립하듯 **"빈 껍데기(Stub)"** 부터 하나씩 만들어 갈 것입니다.

> [!TIP]
> **⌨️ VS Code에서 파일을 빠르게 만드는 법**
> 1. **`Cmd + N` (Mac) / `Ctrl + N` (Windows)**: 이 단축키를 누르면 아무것도 적혀있지 않은 **새로운 빈 탭(새 종이)**이 생깁니다.
> 2. **`Cmd + S` (Mac) / `Ctrl + S` (Windows)**: 그 상태에서 저장 단축키를 누르면 **'어디에 어떤 이름으로 저장할지'** 묻는 창이 뜹니다.
> 3. **이름 입력**: 이때 파일 이름(예: `server.ts`)을 정확히 입력하고, 아까 만든 `src/gateway` 폴더를 선택해 저장하세요.
> 
> *이렇게 하면 마우스 클릭을 최소화하고 아주 빠르게 5개의 파일을 미리 준비할 수 있습니다.*

---

#### 📦 부품 1: 안내 데스크 (`src/gateway/server.ts`)
*   **역할**: 우리 서버의 "공식 연락처"입니다. 외부(CLI/App)에서는 오직 이 파일만 보고 명령을 내립니다.
*   **필수 코드 (Skeleton)**:
    ```typescript
    // 나중에 실제 구현체(impl)에서 가져와서 밖으로 던져줄 예정입니다.
    // 지금은 빨간 줄이 뜨겠지만, '구조'만 먼저 잡습니다.
    export { startGatewayServer } from "./server.impl.js";
    export type { GatewayServer } from "./server.impl.js";
    ```
*   **이해**: "나는 안내원이야. 사장님(impl)이 오시면 바로 연결해줄게!"라고 선언하는 단계입니다.

---

#### 📦 부품 2: 종합 상황실 (`src/gateway/server.impl.ts`)
*   **역할**: 서버의 모든 기능을 총괄하는 **"뇌(Brain)"** 입니다. 심장박동, 입, 귀, 팔다리를 여기서 다 연결합니다.
*   **필수 코드 (Skeleton)**:
    ```typescript
    import { narrate } from "../narrator.js";

    export interface GatewayServer { /* 서버의 명함 정보 */ }

    export async function startGatewayServer() {
        narrate({ who: "startGatewayServer", role: "총사령관", action: "시스템 기동 시작" });
        // 여기에 앞으로 HTTP, WS, Channel 부품들을 조립할 겁니다.
        console.log("🚀 Gateway Server is ready!");
    }
    ```
*   **이해**: 모든 부품이 모이는 **"중앙 제어반"**을 설치한 것입니다.

---

#### 📦 부품 3: 서버의 입 (`src/gateway/server-http.ts`)
*   **역할**: 웹브라우저나 외부 요청을 받는 **"입(Mouth)"** 입니다. (`Hono` 라이브러리 사용)
*   **필수 코드 (Skeleton)**:
    ```typescript
    import { Hono } from "hono";

    export function createHttpServer() {
        const app = new Hono();
        app.get("/", (c) => c.text("Hello! This is Gateway."));
        return app;
    }
    ```
*   **이해**: 외부 사람들과 대화할 수 있는 **"창구"**를 개설한 것입니다.

---

#### 📦 부품 4: 서버의 귀 (`src/gateway/server-ws-runtime.ts`)
*   **역할**: 실시간으로 데이터를 주고받는 **"귀(Ears)"** 입니다. (WebSocket 처리)
*   **필수 코드 (Skeleton)**:
    ```typescript
    export function attachGatewayWsHandlers() {
        // WebSocket 연결이 들어오면 "누구세요?" 하고 듣는 로직이 들어갑니다.
        console.log("👂 Listening for real-time messages...");
    }
    ```
*   **이해**: 전화선을 뽑지 않고 계속 들고 있는 **"실시간 통화 대기상태"**를 만든 것입니다.

---

#### 📦 부품 5: 서버의 팔다리 (`src/gateway/server-channels.ts`)
*   **역할**: 왓츠앱, 슬랙 등으로 직접 메시지를 쏘는 **"팔다리(Limbs)"** 입니다.
*   **필수 코드 (Skeleton)**:
    ```typescript
    export function createChannelManager() {
        return {
            sendMessage: (msg: string) => console.log(`[Limbs] Sending: ${msg}`),
            connect: () => console.log("[Limbs] Ready to move!")
        };
    }
    ```
*   **이해**: 실제로 물건을 나르고(메시지 전송) 행동하는 **"실행 부서"**를 만든 것입니다.

---

#### 📦 부품 6: 해설자 (`src/narrator.ts`)
*   **역할**: 시스템의 모든 활동을 실시간으로 중계하고 기록하는 **"해설자(Narrator)"** 입니다.
*   **필수 코드 (Skeleton)**:
    ```typescript
    import fs from 'fs';

    export function narrate(info: {
      who: string;
      role: string;
      action: string;
      friend?: string;
    }) {
      const logMessage = `[${new Date().toISOString()}] 
      👤 WHO: ${info.who}
      🛡️ ROLE: ${info.role}
      🎬 ACTION: ${info.action}
      ${info.friend ? `🔗 CONTACT: ${info.friend}` : ""}
      --------------------------------------------------\n`;

      console.log(logMessage);
      fs.appendFileSync('learning.log', logMessage);
    }
    ```
*   **이해**: 나중에 문제가 생겼을 때 범인을 찾을 수 있게 해주는 **"CCTV 및 기록관"**을 고용한 것입니다.

---

#### 2-4-6. [에러 제로] 6대 부품 완벽 설정 가이드

뼈대 코드를 다 만들었는데 빨간 줄(에러)이 떠서 당황스러우신가요? 다음 단계를 따라 하면 모든 에러를 깨끗하게 없앨 수 있습니다.

**1. `src/narrator.ts` 에러 해결 (Node.js 타입 설치)**
TypeScript가 `fs` 모듈을 모를 때 발생합니다. 터미널에 아래 명령어를 입력하세요. (워크스페이스 환경에서는 `-w` 옵션이 필수입니다.)
```bash
pnpm add -D @types/node -w
```
*만약 워크스페이스 에러가 계속 난다면: `pnpm install --ignore-workspace-root-check` 를 시도하세요.*

**2. 파일 확장자 주의사항 (The .js Magic)**
코드에서 파일을 임포트할 때 `.ts`가 아닌 **`.js`**를 써야 합니다.
*   **잘못된 예**: `from "./server.impl"`
*   **올바른 예**: `from "./server.impl.js"` (TypeScript가 컴파일된 미래의 파일명을 미리 부르는 약속입니다.)

**3. Hono 라이브러리 설치**
`server-http.ts`에서 에러가 난다면 메신저(혀)를 설치하지 않은 것입니다.
```bash
pnpm add hono
```

---

#### 📋 6대 핵심 부품 최종 코드 요약 (한 눈에 보기)

이제 위 설정이 끝났다면, 아래 코드들을 각 파일에 복사해 넣으세요. 단 한 줄의 빨간 줄도 뜨지 않을 것입니다.

**① `src/gateway/server.ts`**
```typescript
export { startGatewayServer } from "./server.impl.js";
export type { GatewayServer } from "./server.impl.js";
```

**② `src/gateway/server.impl.ts`**
```typescript
import { narrate } from "../narrator.js";
export interface GatewayServer { close?: () => Promise<void> }
export async function startGatewayServer() {
    narrate({ who: "startGatewayServer", role: "총사령관", action: "시스템 기동" });
    console.log("🚀 Gateway Server is ready!");
}
```

**③ `src/gateway/server-http.ts`**
```typescript
import { Hono } from "hono";
export function createHttpServer() {
    const app = new Hono();
    app.get("/", (c) => c.text("Gateway Online"));
    return app;
}
```

**④ `src/gateway/server-ws-runtime.ts`**
```typescript
export function attachGatewayWsHandlers() {
    console.log("👂 Listening for real-time messages...");
}
```

**⑤ `src/gateway/server-channels.ts`**
```typescript
export function createChannelManager() {
    return { connect: () => console.log("[Limbs] Ready!") };
}
```

**⑥ `src/narrator.ts`**
*   **중요**: 이 파일이 없으면 다른 모든 부품에서 에러가 납니다. (기반 시스템)
```typescript
import fs from 'fs';
export function narrate(info: { who: string; role: string; action: string; friend?: string; }) {
    const logMessage = `[${new Date().toISOString()}] 
  👤 WHO: ${info.who}
  🛡️ ROLE: ${info.role}
  🎬 ACTION: ${info.action}
  ${info.friend ? `🔗 CONTACT: ${info.friend}` : ""}
  --------------------------------------------------\n`;
    console.log(logMessage);
    fs.appendFileSync('learning.log', logMessage);
}
```

---

---

### 2-5. [중간 체크포인트] 6대 핵심 부품 '엔진 점화' 테스트 (Middle Checkpoint)

"내가 복사해 넣은 뼈대 코드가 정말 살아있을까요?"
이제 6대 핵심 부품(게이트웨이 5형제 + 해설자)이 서로 손을 잡고 돌아가는지 확인할 시간입니다. 이 테스트를 통과해야 다음 심화 단계로 넘어갈 수 있습니다.

#### 단계 1: 사령탑(`server.impl.ts`) 최종 조립
상황실에서 각 부서장들을 호출하도록 코드를 업그레이드합니다. (이 코드가 부품들을 하나로 묶는 '접착제'입니다.)

```typescript
import { narrate } from "../narrator.js";
import { createHttpServer } from "./server-http.js";
import { attachGatewayWsHandlers } from "./server-ws-runtime.js";
import { createChannelManager } from "./server-channels.js";

export interface GatewayServer { close?: () => Promise<void> }

export async function startGatewayServer() {
    // 1. 해설자 등판
    narrate({ who: "startGatewayServer", role: "총사령관", action: "모든 부서 소집 시작" });
    
    // 2. 부품들 차례대로 깨우기 (뼈대 연결)
    const http = createHttpServer();
    attachGatewayWsHandlers();
    const channels = createChannelManager();
    
    // 3. 작동 확인 (메시지 쏴보기)
    channels.connect(); 
    
    narrate({ who: "startGatewayServer", role: "총사령관", action: "기동 완료 보고" });
    console.log("✅ [Check] 모든 시스템이 정상 연결되었습니다!");
}
```

#### 단계 2: 시동 키(`start.ts`) 생성 및 실행
우리 프로젝트 최상위 폴더(Root)에 서버를 켜기 위한 실습용 파일을 만듭니다.

1.  **파일 위치**: `start.ts` (루트 폴더)
2.  **코드 입력**:
    ```typescript
    import { startGatewayServer } from "./src/gateway/server.js";
    console.log("🔑 [System] 시동 키를 돌립니다...");
    startGatewayServer();
    ```
3.  **실행**: 터미널에서 아래 명령어를 입력하세요.
    ```bash
    npx tsx start.ts
    ```

#### 📊 성공 결과 (터미널 출력 확인)
이대로 나온다면 여러분의 서버는 **"의학적으로 생존(Healthy Skeleton)"** 상태입니다!
```text
🔑 [System] 시동 키를 돌립니다...
[202X-XX-XXT...] 👤 WHO: startGatewayServer 🛡️ ROLE: 총사령관 🎬 ACTION: 모든 부서 소집 시작
👂 Listening for real-time messages...
[Limbs] Ready!
[202X-XX-XXT...] 👤 WHO: startGatewayServer 🛡️ ROLE: 총사령관 🎬 ACTION: 기동 완료 보고
✅ [Check] 모든 시스템이 정상 연결되었습니다!
```

---

#### 🔍 [자가 진단] 코너: 왜 이렇게 조립하나요?

1.  **의존성 주입 확인**: `server.impl.ts`는 `createHttpServer`가 내부에서 `Hono`를 쓰는지 `Express`를 쓰는지 모릅니다. 단지 "일을 시킬 수 있는 이름"만 가져왔을 뿐입니다.
2.  **로그 추적 확인**: `narrator.ts`를 통해 시스템의 기상 순서를 실시간으로 추적할 수 있는지 확인하세요.
3.  **에러 대처법 (Troubleshooting)**:
    *   **"export ..." 에러**: 파일 안에 `export` 키워드를 빼먹진 않았나요?
    *   **".js" 에러**: 임포트 경로 끝에 반드시 `.js`를 붙여야 합니다. (ESM 규칙)

---




---

### 2-6. [배경 지식] 왜 6명의 전사가 필요한가? (The 6 Warriors)

우리는 이제 6명의 핵심 멤버를 모두 소집했습니다. 이들은 각각 고유한 역할을 수행하며, 사령관(`server.impl.ts`)의 지휘 아래 하나의 유기체처럼 움직입니다. 

1. **전령(`server.ts`)**: 외부의 요청을 받고 적절한 곳으로 연결합니다.
2. **사령관(`server.impl.ts`)**: 모든 부품의 생명주기를 관리하고 조율합니다.
3. **입(`server-http.ts`)**: 웹 세상과 소통하는 표준 창구입니다.
4. **귀(`server-ws-runtime.ts`)**: 실시간 대화를 듣는 신경망입니다.
5. **팔다리(`server-channels.ts`)**: 실제 메시지를 전달하는 행동 대원입니다.
6. **기록관(`narrator.ts`)**: 모든 탄생과 활동의 역사를 기록합니다.

이제 이들이 구체적으로 어떻게 태어나는지, 한 명씩 정밀 해부해 보겠습니다.

---

### 2-7. [확대 분석] 서버 진입점 생성 (`src/gateway/server.ts`) - **[단계 1: 기초 공사/얼굴]**



가장 먼저 이 파일을 만듭니다. 이 파일은 서버의 **"안내 데스크(Front Desk)"** 입니다.

> [!NOTE]
> **🛠️ VS Code 실전 조립 절차**
> 1.  **파일 생성**: 탐색기(Explorer)에서 `src/gateway` 폴더를 우클릭하고 `New File`을 선택합니다.
> 2.  **이름 입력**: `server.ts`를 입력하고 엔터를 칩니다.
> 3.  **코드 작성**: 아래 **'#### 2-1-2. 코드 씹어먹기'** 섹션에 있는 `export` 문장들을 입력합니다. 이 문장들은 다른 파일에 있는 기능을 가져와서 곧바로 밖으로 연결해주는 **'전달 통로'** 역할을 합니다.


#### 2-1-1. [초정밀 해부도] Front Desk Map
오시다시피 이 파일은 **아무런 로직이 없습니다.** 오직 다른 파일로 연결만 해줍니다. 이것을 디자인 패턴에서는 **퍼사드 패턴(Facade Pattern)** 이라고 합니다.

```text
[외부 세상: CLI, Docker]
       ⬇️ (접속: "서버 켜줘!")
       ⬇️
src/gateway/server.ts (안내 데스크)
       │
       ├── 1. "사장실 연결해 드립니다." (startGatewayServer)
       │       ⤷ 연결 ➡ src/gateway/server.impl.ts (진짜 CEO: 뇌)
       │
       ├── 2. "보안 규정집 여기 있습니다." (truncateCloseReason)
       │       ⤷ 연결 ➡ src/gateway/server/close-reason.ts (규정집)
       │
       └── 3. "명함 양식입니다." (GatewayServer Type)
               ⤷ 연결 ➡ src/gateway/server.impl.ts (타입 정의)
```

#### 2-1-2. 코드 씹어먹기 (Code Anatomy)
`src/gateway/server.ts`

```typescript
// [1] 보안 요원 연결 (Security)
// 역할: 웹소켓 연결 끊을 때 이유가 너무 길면(해킹 시도 등) 적당히 자르는 함수를 내보냅니다.
export { truncateCloseReason } from "./server/close-reason.js";

// [2] 명함(Type) 공유 (Public Card)
// 역할: "우리 사장님(GatewayServer)은 이렇게 생겼습니다"라고 외부에 알려줍니다.
export type { GatewayServer, GatewayServerOptions } from "./server.impl.js";

// [3] 사장실 연결 (The Real Boss)
// 핵심: 실제로 서버를 켜는 함수(startGatewayServer)를 밖으로 내보냅니다.
// 외부(CLI)에서는 이 파일의 startGatewayServer만 호츨하면, 내부 사정을 몰라도 서버가 켜집니다.
export { __resetModelCatalogCacheForTest, startGatewayServer } from "./server.impl.js";
```

#### 2-1-3. [TS 문법 교실] 이게 무슨 뜻인가요? (Grammar Class)

초보자가 가장 헷갈려 하는 3가지 문법을 **완벽하게 분해**해 드립니다.

*   **1. `export { ... } from "..."`**: **"국제 배송 대행 서비스"**
    *   **의미**: "저쪽 파일(`from`)에 있는 물건을 가져와서, 내 이름으로 다시 해외 수출(`export`)하겠다."
    *   **은유(Metaphor)**: 쿠팡(server.ts)이 삼성전자(server.impl.ts)의 냉장고를 떼와서 쿠팡 이름으로 파는 것과 같습니다. 소비자는 삼성 공장에 갈 필요 없이 쿠팡에서 사면 됩니다.

*   **2. `export type`**: **"설계도면 vs 실제 건물"**
    *   **의미**: "Java/C#의 Class나 Interface 같은 **껍데기(모양)** 만 내보냅니다."
    *   **은유(Metaphor)**:
        *   `export class` (GatewayServer): 실제 살 수 있는 **아파트**입니다. (메모리 차지함)
        *   `export type` (GatewayServer): 아파트 **설계도(청사진)** 종이입니다. (메모리 차지 안 함)
    *   **Why?**: TypeScript는 컴파일되면 JavaScript로 변합니다. 이때 `type`으로 정의된 건 **흔적도 없이 사라집니다(Ghost).** 개발할 때 자동완성 힌트만 주고, 런타임에는 가볍게 사라지기 위해 씁니다.

*   **3. `{ a, b }` (중괄호)**: **"종합 선물 세트 뜯기"**
    *   **문법 이름**: **구조 분해 할당 (Destructuring Assignment)**
    *   **의미**: "`server.impl.js`라는 큰 선물 상자 안에 여러 가지가 들어있는데, 그중에서 `__reset...`이랑 `startGatewayServer`라는 딱 2개만 콕 집어서 꺼내겠다."
    *   **예시**:
        ```typescript
        const Box = { candy: 10, chocolate: 5, gum: 3 };
        const { candy, gum } = Box; // 초콜릿은 안 꺼냄!
        ```

#### 2-1-3. [배경 지식] 왜 껍데기 파일을 따로 만드나요? (Why Facade?)

이것은 소프트웨어 공학에서 **"변경에 대한 방어막(Decoupling)"** 을 치는 기술입니다. 쉬운 예시를 들어보겠습니다.

**🏠 실생활 예시: "고객센터 대표번호 (1588-0000)"**

*   **상황**: 여러분이 쇼핑몰 CEO입니다. 전국에 흩어진 상담원들이 전화를 받습니다.
*   **껍데기(`server.ts`)**: **대표번호 1588-0000**
*   **실체(`server.impl.ts`)**: 실제 상담 센터 (처음엔 **서울** 사무실)

**🌪 사건 발생**: 서울 사무실 임대료가 비싸서 **부산**으로 이사 가기로 했습니다. (`server.impl.ts` -> `server.busan.ts` 로 파일명 변경)

1.  **대표번호가 없을 때 (No Facade)**:
    *   고객 100만 명에게 전부 문자를 보내야 합니다.
    *   *"죄송합니다. 번호가 02-123-4567에서 051-987-6543으로 바뀌었습니다. 다시 저장해주세요."*
    *   코드로 치면, 이 파일을 `import`해서 쓰는 **모든 파일 100개를 찾아서 수정**해야 합니다. (대재앙)

2.  **대표번호가 있을 때 (Facade Pattern)**:
    *   고객은 아무것도 몰라도 됩니다. 여전히 1588-0000으로 걸면 됩니다.
    *   CEO인 여러분은 **대표번호 연결 설정(Routing)** 만 서울에서 부산으로 1줄 바꾸면 끝입니다.
    *   코드로 치면, **`server.ts`의 `import` 경로 1줄만 수정**하면 프로젝트 전체가 멀쩡하게 돌아갑니다.

**결론**: `server.ts`는 귀찮은 껍데기가 아니라, 미래의 변화로부터 우리를 지켜주는 **"안전 장치"** 입니다.

#### 2-1-4. [잠깐만] 안전장치 직접 실험해보기 (Facade Lab)

"말로만 듣지 말고, **진짜 안전한지** 직접 터트려봅시다."

이 개념을 확실히 잡고 가기 위해, 아주 간단한 **실험실(Lab)** 을 만들어보겠습니다. 폴더 아무데나 `test-facade` 폴더를 만들고 3개의 파일을 만드세요.

**1. `core-v1.js` (실체: 구형 엔진)**
```javascript
// 실제 로직이 들어있는 파일
export function startEngine() {
  console.log("🚗 V1 엔진: 부릉부릉 (시끄러움)");
}
```

**2. `gateway.js` (껍데기: 안전장치)**
```javascript
// 여기가 핵심입니다! 실체를 import해서 그대로 내보냅니다.
export * from "./core-v1.js"; 
```

**3. `client.js` (사용자: 운전자)**
```javascript
// 운전자는 'core-v1.js'를 모릅니다. 오직 'gateway.js'만 압니다.
import { startEngine } from "./gateway.js";

console.log("👤 운전자: 시동을 겁니다.");
startEngine();
```

---

**🧪 실험 시작: 미래를 바꾸는 시나리오 4단계**

**1단계: 평화로운 일상 (Initial Run)**
먼저 터미널에서 `node client.js`를 입력해서 실행해 보세요.
화면에 **"🚗 V1 엔진: 부릉부릉"** 하고 시끄러운 소리가 날 겁니다.
지금 운전자(`client.js`)는 `gateway.js`를 통해 구형 엔진을 쓰고 있습니다. 평화롭죠?

**2단계: 위기 발생 (Refactoring Needed)**
어느 날, 정부에서 "소음 규제"를 발표합니다. 더 이상 시끄러운 V1 엔진을 쓸 수 없게 되었습니다.
자, 이제 `core-v1.js` 파일을 과감하게 **삭제**해 버리세요. 그리고 **`core-v2.js`** 라는 새 파일을 만들고 아래 코드를 넣습니다.
```javascript
export function startEngine() {
  console.log("⚡️ V2 모터: 위이잉 (조용함)");
}
```
이제 실체(엔진)가 완전히 바뀌어 버렸습니다.

**3단계: 마법의 방어 (The Fix)**
보통 같으면 운전자(`client.js`) 코드를 뜯어고쳐야겠지만, 우리는 그럴 필요가 없습니다.
중간에 있는 **`gateway.js`** 파일만 살짝 여세요. 그리고 `from` 뒤에 있는 경로만 바꿔주면 됩니다.
```javascript
export * from "./core-v2.js"; // v1 -> v2 로 숫자 하나만 바꿨습니다.
```
운전자 몰래, 카센터 사장님(Gateway)이 엔진을 최신형으로 바꿔치기한 겁니다.

**4단계: 결과 확인 (Verification)**
다시 `node client.js`를 실행해 보세요.
놀랍게도 운전자는 아무런 에러 없이 **"⚡️ V2 모터: 위이잉"** 하고 전기차를 몰게 됩니다.
운전자는 엔진이 바뀐 줄도 모릅니다. 단지 차가 조용해졌다고 좋아할 뿐이죠.

> [!IMPORTANT]
> **🎓 결론: 이것이 바로 '유지보수'입니다**
>
> 여러분이 방금 하신 일이 바로 **"의존성 분리(Decoupling)"** 입니다.
> 내무 부품이 싹 다 바뀌어도, 바깥세상(Client)에는 충격을 주지 않는 것. 이것이 시니어 개발자들이 `server.ts` 같은 껍데기 파일을 굳이 만들어 두는 이유입니다.


> [!IMPORTANT]
> **🚀 이 책(매뉴얼)의 최종 목표**
> 비록 지금은 초보자일지라도, 이런 고급 아키텍처 경험을 하나하나 빠르게 쌓아서 **"시니어 개발자의 통찰력"** 을 갖추는 것이 목표입니다.
> 그래야만 단순히 AI가 짜주는 코드를 받아 적는 것을 넘어, **AI 코딩 에이전트들을 내 손바닥 위에서 자유자재로 지휘하고 주무르는** 진짜 사령관이 될 수 있습니다.

---




---

### 2-8. [확대 분석] 서버 뇌 구현 (`src/gateway/server.impl.ts`) - **[단계 2: 골격 조립]**



안내 데스크(`server.ts`)의 문을 열고 들어오셨군요. 환영합니다.
이곳은 OpenClaw(Moltbot) 시스템의 가장 깊숙한 곳, **"종합 상황실(NASA Control Room)"** 입니다.

> [!NOTE]
> **🛠️ VS Code 실전 조립 절차**
> 1.  **파일 생성**: `src/gateway/server.impl.ts` 파일을 생성합니다.
> 2.  **자동 완성 활용**: `interface`나 `function`을 칠 때 VS Code가 제안하는 코드 힌트를 적극적으로 활용하세요.
> 3.  **임포트 체크**: 상단에 있는 `narrate` 함수가 정확한 경로(`../narrator.js`)에서 오고 있는지 확인하세요. (ESM 방식이므로 `.js` 확장자를 붙이는 것이 포인트입니다!)


#### 2-8-1. [실제 완성 코드] `src/gateway/server.impl.ts` (핵심 엔진)

이 코드는 OpenClaw 시스템의 모든 부품을 조립하는 **최종 설계도**입니다. 500줄이 넘는 방대한 양이지만, 핵심이 되는 `startGatewayServer` 함수의 내부 로직을 상세히 파헤쳐 보겠습니다.

```typescript
// [1] 임포트 섹션 (생략)
import { ... } from "..."
import { narrate } from "../narrator.js"; 

// [2] 타입 정의
export type GatewayServer = {
  close: (opts?: { reason?: string; restartExpectedMs?: number | null }) => Promise<void>;
};

// [3] 사령관 함수: 서버 기동의 모든 단계를 지휘합니다.
export async function startGatewayServer(
  port = 18789,
  opts: GatewayServerOptions = {},
): Promise<GatewayServer> {
  // 1단계: 환경 변수 및 설정 준비
  process.env.CLAWDBOT_GATEWAY_PORT = String(port);
  let configSnapshot = await readConfigFileSnapshot();
  
  // 2단계: 레거시 설정 마이그레이션 (과거의 유산 정리)
  if (configSnapshot.legacyIssues.length > 0) {
    const { config: migrated, changes } = migrateLegacyConfig(configSnapshot.parsed);
    await writeConfigFile(migrated);
    log.info(`gateway: migrated legacy config entries`);
  }

  // 3단계: 장기(Subsystems) 초기화
  narrate({ who: "startGatewayServer", role: "총사령관", action: "장기 부착 시작" });
  const nodeRegistry = new NodeRegistry();
  const channelManager = createChannelManager({
    loadConfig,
    channelLogs,
    channelRuntimeEnvs,
  });

  // 4단계: 실시간 통신망(WebSocket) 및 HTTP 서버 기동
  const { httpServer, wss, clients, broadcast } = await createGatewayRuntimeState({
    cfg: loadConfig(),
    bindHost: "0.0.0.0",
    port,
    // ... 기타 설정들
  });
  
  // 5단계: 신경망 핸들러 연결 (데이터가 흐르기 시작하는 지점)
  attachGatewayWsHandlers({
    wss,
    clients,
    port,
    gatewayMethods,
    logGateway: log,
    broadcast,
    context: {
        // ... 서버의 모든 기능을 핸들러에 주입 (Dependency Injection)
        nodeRegistry,
        channelManager,
        cron,
        loadGatewayModelCatalog,
    }
  });

  // 6단계: 외부 노출 및 보안 설정 (Tailscale 등)
  const tailscaleCleanup = await startGatewayTailscaleExposure({ ... });

  // 7단계: 기동 완료 보고
  log.info("🚀 Gateway Server is ready for action!");
  narrate({ who: "startGatewayServer", role: "총사령관", action: "기동 완료 보고" });

  // 8단계: 통제권 반환 (종료 버튼 제공)
  return {
    close: async (opts) => {
      await close(opts); // 모든 장기 정지 및 메모리 해제
      log.info("🛑 Gateway Server shut down safely.");
    },
  };
}
```

> [!TIP]
> **500줄의 전체 미로를 탐험하고 싶다면?**
> 실시간 업데이트되는 전체 원본 소스 코드는 프로젝트 내 [server.impl.ts](file:///Users/sl/Workspace/moltbot-2026.1.24/src/gateway/server.impl.ts) 파일에 보존되어 있습니다. 이 코드는 **"어떻게 70개의 파일이 하나로 꿰어지는가"**에 대한 정답지입니다. 



눈앞에 펼쳐진 **약 600줄의 코드**가 위압적으로 느껴지십니까? 당연합니다.
이곳은 단순한 코드가 아닙니다. 서버의 오감을 깨우고, 인공지능 두뇌를 연결하고, 전 세계와 통신하는 신경망을 지휘하는 **"사령부"** 이기 때문입니다.

*   **좌측 스크린**: `HTTP Server`가 웹에서 들어오는 신호를 감시합니다.
*   **우측 스크린**: `WebSocket`이 수천 개의 실시간 연결을 유지합니다.
*   **중앙 콘솔**: `Agent Runner`가 AI(GPT-4)에게 끊임없이 명령을 내립니다.
*   **백그라운드**: `Heartbeat`가 시스템의 생명 반응을 주기적으로 체크합니다.

이 모든 것이 단 하나의 파일, `server.impl.ts` 안에서 조율됩니다.
복합해 보이지만 걱정하지 마십시오. 우리는 이 거대한 우주선을 **"단 5개의 버튼"** 으로 분해해서 하나씩 조립할 것입니다. (이것이 앞에서 설명드린 **추상화**를 의미하는 것 기억 나시죠?)

준비되셨나요? 이제 사령관(`startGatewayServer`)의 의자에 앉아 볼 시간입니다.

#### 2-8-2. [공급망 분석] import 목록 73줄, 어떻게 처리하나요? (Supply Chain)

"import가 70줄이나 되는데, 이걸 다 만들어야 하나요?"
네, 하지만 **"내용"을 다 만들 필요는 없습니다.** 껍데기(Stub)만 있으면 됩니다. 이 70줄은 크게 5가지 그룹으로 나뉩니다.

*   **1. 외부 기관 (External Agencies)**:
    *   `../config/*`: 설정 파일 등본을 떼오는 곳.
    *   `../infra/*`: 진단(Diagnostic), 심장 박동(Heartbeat), 재시작(Restart) 등 생명 유지 장치.
    *   `../logging/*`: 블랙박스 기록 장치.
*   **2. 에이전트 본부 (Agent HQ)**:
    *   `../agents/*`: AI 두뇌 관리소.
*   **3. 내부 장기 (Internal Organs)**:
    *   `./server-*`: HTTP, WS, Channel 등 서버의 실제 부품들.

> [!IMPORTANT]
> **💡 [핵심 전략] "가짜로 채워라 (Fake it till you make it)"**
>
> 70개 파일을 다 구현하다간 지쳐 떨어집니다. **"빈 파일 전략(Stubbing)"** 을 쓰세요.
>
> 1.  **빨간 줄 없애기 게임**: `server.impl.ts`를 복사해서 붙여넣으면 온통 빨간 줄(에러)입니다.
> 2.  **빈 파일 생성**: 에어러가 나는 경로(예: `../infra/heartbeat.ts`)에 파일을 만듭니다.
> 3.  **가짜 수출(Export)**: 함수 내용을 비워두고 `export`만 하세요.
>     ```typescript
>     // ../infra/heartbeat.ts
>     // 껍데기만 만듭니다. 내용은 나중에 채웁니다.
>     export function startHeartbeatRunner() { console.log("Heartbeat started (fake)"); }
>     ```
> 4.  **컴파일 성공**: 빨간 줄이 다 사라지면, 서버는 켜집니다. (물론 아무 기능도 안 하겠지만, 골격은 완성된 겁니다.)

#### 2-8-3. [상세 분석] 함수 명예의 전당 (Function Hall of Fame)

> [!QUESTION]
> **Q. 사령관님, 질문 있습니다!**
> "`server.impl.ts`의 90~92번째 줄을 봤는데, `GatewayServer` 타입이 너무 심플합니다. 고작 `close` 함수 하나밖에 없는데요?"
>
> ```typescript
> export type GatewayServer = {
>   close: (opts?: ...) => Promise<void>;
> };
> ```
>
> **A. 전문가의 통찰력 (Expert's Insight)**
> 아주 날카로운 질문입니다! 여기서 우리는 **"추상화의 미학(The Art of Abstraction)"** 을 배워야 합니다.
>
> 1.  **빙산의 일각 (Tip of the Iceberg)**:
>     *   빙산은 물 위에 10%만 보이고, 물 밑에 90%가 숨어 있죠.
>     *   `GatewayServer`는 물 위에 나온 10%입니다. 외부(CLI)에서는 서버를 "켜고(start)", "끄는(close)" 것 외에는 알 필요가 없게 만든 것입니다. 내부에서 100만 줄의 코드가 돌아가든 말든, 사용자는 **"전원 버튼"** 하나면 충분합니다.
>
> 2.  **핵가방 (Nuclear Football)**:
>     *   대통령의 핵가방에는 복잡한 미사일 회로가 들어있지 않습니다. 오직 **"발사 버튼"** 과 **"취소 버튼"** 만 있습니다.
>     *   만약 리모컨에 버튼이 100개라면(예: `server.http`, `server.ws` 다 노출), 사용자는 헷갈려서 사고를 칠 겁니다.
>     *   **"가장 훌륭한 인터페이스는 더 이상 뺄 것이 없는 상태다."** 이 단순함이 바로 고수가 설계했다는 증거입니다.

각 함수의 역할과, 초보자가 이를 어떻게 복제(Cloning)해야 하는지 하나씩 뜯어보겠습니다.

##### 1. `loadConfig` (보급관: 엄격한 세관원)
*   **역할**: `config.yaml` 파일을 읽어서 자바스크립트 객체로 변환합니다. 그냥 읽는 게 아니라, **"빠진 항목은 없는지, 타입은 맞는지"** 검사(Validation)합니다.
*   **입력(Input)**: `CONFIG_PATH` (파일 경로 문자열)
*   **출력(Output)**: `ClawdbotConfig` (검증된 설정 객체) 또는 **에러 폭발(Throw Error)**
*   **코드 분석**:
    ```typescript
    // 실제 로직 (Zod 라이브러리 사용)
    const raw = fs.readFileSync("config.yaml"); // 1. 파일 읽기
    const parsed = yaml.parse(raw);             // 2. 파싱
    const config = ClawdbotSchema.parse(parsed); // 3. 검증 (여기서 틀리면 에러!)
    return config;
    ```
*   **초보자 클론 전략 (Stub First)**:
    *   **Stub Code**:
        ```typescript
        import { narrate } from "../narrator";

        export function loadConfig() {
            narrate({ 
                who: "loadConfig", 
                role: "보급관", 
                action: "설정 파일 로딩 시늉" 
            });
            return { agents: { defaults: { model: "gpt-4" } } };
        }
        ```

##### 2. `startHeartbeatRunner` (의무병: 자동 심장충격기)
*   **역할**: 주기적으로(예: 1시간마다) 봇이 살아있는지 확인하고, 필요하면 자가 진단 메시지를 보냅니다. "활동 시간(Active Hours)"인지 체크해서 밤에는 조용히 시킵니다.
*   **입력(Input)**: `Config` (설정 객체)
*   **출력(Output)**: `HeartbeatRunner` (멈춤 버튼 `stop()`이 달린 handle)
*   **초보자 클론 전략 (Stub First)**:
    *   **Stub Code**:
        ```typescript
        import { narrate } from "../narrator";

        export function startHeartbeatRunner() {
            narrate({ 
                who: "startHeartbeatRunner", 
                role: "의무병", 
                action: "심장 박동기 가동" 
            });
            return { stop: () => { console.log("MEDIC: Stopped"); } };
        }
        ```

##### 3. `createChannelManager` (외교관: 만국 공통어 통역사)
*   **역할**: WhatsApp, Slack, Discord 등 서로 다른 언어를 쓰는 외부 채널들을 관리합니다. 각 채널을 켜고(`start`), 끄고(`stop`), 상태를 확인하는 제어판입니다.
*   **입력(Input)**: `ChannelManagerOptions` (로그, 설정 등)
*   **출력(Output)**: `ChannelManager` (채널 제어 메서드 모음)
*   **초보자 클론 전략 (Stub First)**:
    *   **Stub Code**:
        ```typescript
        import { narrate } from "../narrator";

        export function createChannelManager() {
            return {
                startChannels: async () => { 
                    narrate({ 
                        who: "startChannels", 
                        role: "외교관", 
                        action: "모든 대사관(WhatsApp, Slack) 연결" 
                    });
                }
            };
        }
        ```

##### 4. `createHttpServer` (대변인: 기자회견장)
*   **역할**: 외부에서 들어오는 요청(HTTP Request)을 받아서 적절한 담당자에게 토스합니다.
    *   `/v1/hooks` -> `hooks.ts` (웹훅 담당)
    *   `/slack/events` -> `slack.ts` (슬랙 담당)
    *   `/ui` -> `control-ui.ts` (관리자 화면 담당)
*   **입력(Input)**: `handleHooksRequest`, `controlUiEnabled` 등 (각 부서의 연락처)
*   **출력(Output)**: `HttpServer` (Node.js 서버 객체)
*   **초보자 클론 전략 (Stub First)**:
    *   **Stub Code**:
        ```typescript
        import { Hono } from "hono";
        import { narrate } from "../narrator";
        
        export function createHttpServer() {
            const app = new Hono();
            app.get("/", (c) => {
                narrate({ 
                    who: "HttpHandler", 
                    role: "대변인", 
                    action: "기자(Client) 질문 응대" 
                });
                return c.text("SPOKESPERSON: I am ready.");
            });
            return app;
        }
        ```

##### 5. `attachGatewayWsHandlers` (통신병: 전화선 개통)
*   **역할**: 들어오는 소켓 연결(`connection`)을 감지하고, "누구십니까(Auth)"를 물어보고, "연결되었습니다" 도장을 찍어주는 수문장입니다.
*   **입력(Input)**: `wss` (웹소켓 서버), `clients` (접속자 명단)
*   **출력(Output)**: `void` (돌려주는 것 없음. 그냥 전화선만 꽂아둠)
*   **초보자 클론 전략 (Stub First)**:
    *   **Stub Code**:
        ```typescript
        import { narrate } from "../narrator";

        export function attachGatewayWsHandlers({ wss }) {
            wss.on("connection", (ws) => {
                narrate({ 
                    who: "WsHandler", 
                    role: "통신병", 
                    action: "새로운 전화 연결 수락" 
                });
            });
        }
        ```

> [!TIP]
> **"Stubbing(껍데기 만들기)"** 은 초보자의 꼼수가 아니라, 시니어 개발자가 복잡도를 관리하는 **가장 프로페셔널한 기술**입니다. 
> 700줄을 한 번에 짜는 사람은 세상에 없습니다. 위에서 알려드린 **5개의 껍데기 함수**만 먼저 파일에 복붙하고, `startGatewayServer` 안에서 호출만 해보세요. **에러 없이 실행되는 기쁨**을 먼저 맛보셔야 합니다.

#### 2-8-4. [AI 시대의 코딩] TypeScript 문법, 굳이 배워야 하나요?

"AI가 코드 다 짜주는데, 문법 공부를 해야 하나요?"
> [!IMPORTANT]
> **네, 하지만 관점이 달라야 합니다.** 직접 코딩하기 위해서가 아니라, **AI에게 정확히 지시하기 위해서** 배워야 합니다.

*   **1. Interface/Type = "AI에게 내리는 스펙(Spec)"**
    *   **과거**: 내가 코딩하다 틀리면 컴파일러한테 혼나려고 씀.
    *   **AI 시대**: **"야 AI야, 네가 짤 함수는 반드시 이 모양이어야 해!"** 라고 규격(Spec)을 던져주는 용도.
    *   **전략**: 구현(`function`)보다 타입(`interface`)을 먼저 정의하고 AI에게 던지세요. 그러면 AI가 딴소리를 못 합니다.

*   **2. Promise/Async = "AI야, 잠깐만 기다려"**
    *   **과거**: 비동기 처리가 어려워서 콜백 지옥에 빠짐.
    *   **AI 시대**: "이 작업은 오래 걸리니까(`async`), 다 될 때까지 기다렸다가(`await`) 다음 줄로 넘어가" 라는 **업무 순서 지시서**입니다.

#### 2-8-5. [실전 클론 가이드] AI를 부려먹는 법 (How to Command)

이 복잡한 파일을 혼자 짜지 마세요. 이렇게 지시하십시오.

> [!IMPORTANT]
> **🚀 [미래 예보] 여러분의 역할은 '코더'가 아니라 '기획 개발자'입니다.**
>
> 앞으로 여러분의 역할은 단순히 코드를 치는 코더가 아닙니다. **AI 코딩 에이전트** (예: Google Antigravity, VS Code, KIMI, OpenAI Codex 등) 수많은 자동 개발 도구들을 능숙하게 다루기 위해서는, 개발을 아주 작은 단위로 쪼개고 그 단위가 **'왜 여기에 놓여야 하는지'** 고민하고 다시 배치하는 능력이 필수입니다. 이러한 판단과 기획, 조정을 직접 수행해야만 살아남을 수 있는 세상이 되었습니다.

#### 💡 [깜짝 히스토리] 1970년대의 "천공기"와 사라진 선망의 직업

방금 말씀드린 "코더의 종말" 이야기가 피부에 와닿지 않으신다고요? 역사를 보면 지금의 상황이 데자뷔처럼 느껴지실 겁니다.

*   **1970-80년대의 풍경**: 그 시절엔 모니터도, 키보드도 없었습니다. 개발자가 종이(코딩 시트)에 연필로 코드를 적어주면, **'펀치라이터(Punch Writer)'**라 불리는 전문직 분들이 **천공기(Keypunch Machine)**라는 기계로 종이 카드에 구멍을 뻥뻥 뚫었습니다.
*   **카드 한 장 = 코드 한 줄**: 수천 줄짜리 프로그램은 수천 장의 카드 덱이 되었고, 이 카드를 컴퓨터에 집어넣어야만 계산기가 돌아갔습니다.
*   **그땐 그랬지**: 당시 펀치라이터는 정확도와 속도를 갖춘, 당대 최고의 대우를 받던 **'최첨단 IT 전문직'**이었습니다. 프로그래밍의 결과물을 실제로 '만들어내는' 유일한 사람들이었으니까요.
*   **지금은?**: 키보드와 마우스, 그리고 저장 장치가 발달하며 '구멍을 뚫는 행위(Punching)' 자체는 완전히 사라졌습니다. 이제는 아무도 구멍을 뚫어 코드를 입력하지 않습니다.

> [!TIP]
> **시사하는 점**:
> "구멍을 뚫는 사람"은 사라졌지만, "어디에 구멍을 뚫을지 기획한 사람"은 지금의 소프트웨어 엔지니어가 되었습니다. 이제 **"코드를 한 줄씩 치는 행위"**도 AI가 대신하는 천공기의 길을 걷고 있습니다. 여러분은 단순히 코드를 치는 사람이 아니라, **그 코드가 왜 그 자리에 있어야 하는지 결정하는 '기획 개발자'**가 되어야만 이 거대한 변화의 파도에서 살아남을 수 있습니다.

---

1.  **스텝 1: 빈 껍데기 요청 (Stubbing)**
    > "server.impl.ts의 `startGatewayServer` 함수 뼈대만 만들어줘. 내부는 비워두고, 리턴 타입인 `GatewayServer`만 맞춰줘."
2.  **스텝 2: 설정 로직 주입 (Dependency Injection)**
    > "방금 만든 함수 맨 윗줄에 `loadConfig`를 호출해서 설정을 불러오는 로직만 추가해줘. `loadConfig`는 없는 함수니까 import 문만 적어놔."
3.  **스텝 3: 서브시스템 연결 (Connectivity)**
    > "이제 `createHttpServer`와 `createWebSocketServer`를 호출하는 코드를 중간에 넣어줘."

> [!IMPORTANT]
> **핵심**: AI에게 한 번에 "이거 다 만들어"라고 하지 말고, **"조립 설명서의 한 문장"** 씩 던지세요. 그것이 진짜 엔지니어의 실력입니다.

#### 2-8-6. [TS 문법 심화] 'GatewayServer' 타입 완전 해부

사용자님이 질문하신 `GatewayServer` 타입 정의를 한 줄 한 줄 뜯어보겠습니다. 이것은 **"서버 리모컨의 사용 설명서"** 입니다.

```typescript
export type GatewayServer = {
  // [1] 기능 정의 (Property: Function)
  // "close 버튼을 누르면 서버가 꺼집니다."
  close: (
      // [2] 선택적 옵션 (Optional Parameter)
      // "옵션은 안 넣어도 됩니다(?). 넣는다면 '이유'와 '재시작 시간'을 적으세요."
      opts?: { reason?: string; restartExpectedMs?: number | null }
  ) 
  // [3] 비동기 약속 (Async Return)
  // "버튼을 누르면 즉시 꺼지지 않고, 완전히 꺼질 때까지 기다려야(Promise) 합니다."
  => Promise<void>;
};
```

#### 📖 코드 설명 (Code Explanation)

1.  **`export type GatewayServer = { ... }`**:
    *   **의미**: "앞으로 `GatewayServer`라고 하면, 무조건 중괄호 `{}` 안에 있는 기능들을 가지고 있어야 한다"는 **계약서(Contract)** 입니다.
    *   **AI 활용법**: AI에게 "서버 만들어줘"라고 하기 전에, **"서버의 리모컨은 무조건 이렇게 생겨야 해"** 라고 이 타입을 먼저 던져주세요. 그러면 AI가 엉뚱한 리모컨을 만들어오지 않습니다.

2.  **`opts?:` (물음표의 마법)**:
    *   **문법**: **Optional Parameter**. 있어도 되고 없어도 되는 값.
    *   **은유**: "선풍기 타이머". 타이머를 안 맞추고(`undefined`) 그냥 꺼도 되고, 1시간 뒤에 꺼지라고 맞춰도 됩니다.
    *   **AI 활용법**: "옵션이 너무 복잡해"라고 느끼면 AI에게 **"모든 필드에 `?`를 붙여서 선택 사항으로 바꿔줘(Make everything optional)"** 라고 지시하세요. 코딩이 훨씬 편해집니다.

3.  **`=> Promise<void>`**:
    *   **문법**: **비동기 반환**.
    *   **의미**: "이 함수는 `return` 값이 없습니다(`void`). 하지만 작업이 끝났다는 신호(`Promise`)는 나중에 보내줍니다."
    *   **현실 비유**: "배달 주문". 짜장면을 시키면(함수 호출), 짜장면이 바로 뽕 하고 나타나지 않습니다. "배달 중(Pending)" 상태였다가 나중에 "도착(Resolved)"합니다.
    *   **AI 활용법**: 요즘 서버 코드는 99%가 비동기입니다. AI에게 **"모든 IO 작업은 무조건 `async/await`로 짜줘"** 라고 미리 못 박으세요. 안 그러면 AI가 옛날 방식(동기식)으로 짜서 서버 전체를 멈추게(Blocking) 할 수도 있습니다.

---

```typescript
// [핵심 함수] 이 함수가 실행되면 서버가 태어납니다.
export async function startGatewayServer(port = 18789, opts: GatewayServerOptions = {}) {
  
  // 1. [준비 단계] 비행 전 점검 (Pre-flight Check)
  // 환경 설정(Config)을 읽어오고, 로그 시스템을 켭니다.
  const config = await loadConfig(CONFIG_PATH_CLAWDBOT); 
  const log = createSubsystemLogger("gateway");
  
  // 2. [실행 단계] 심장 박동 시작 (Heartbeat)
  // 서버가 살아있음을 알리는 심장 박동(Heartbeat) 시스템을 가동합니다.
  const heartbeatHandle = startHeartbeatRunner({ /* ... */ });

  // 3. [연결 단계] 각 부서(장기) 소집
  // 입(HTTP), 귀(WebSocket), 팔다리(Channel) 담당자들을 불러옵니다.
  
  // 3-1. 채널 매니저 (팔다리)
  const channelManager = createChannelManager({ /* ... */ });
  
  // 3-2. HTTP 서버 (입)
  // Hono 앱을 만들고 라우팅을 설정합니다.
  const { app, server } = await createHttpServer({ /* ... */ });
  
  // 3-3. WebSocket 서버 (귀)
  // 실시간 통신을 위한 소켓 서버를 엽니다.
  const wss = await createWebSocketServer({ /* ... */ });

  // 4. [최종 승인] 준비 완료
  // 모든 시스템이 정상적으로 떴다는 로그를 남깁니다.
  log.info(`Gateway running on port ${port}`);

  return { 
    // 나중에 서버를 끄거나 조종할 수 있도록 리모컨(객체)을 반환합니다.
    close: async () => { /* 종료 로직 */ } 
  };
}
```

#### 2-8-7. [배경 지식] 왜 이렇게 모든 걸 한 함수에 넣었나요?
*   **의존성 주입(Dependency Injection)**: 각 장기들은 서로가 필요합니다.
    *   `HTTP 서버`는 `채널 매니저`가 필요합니다. (사용자가 웹에서 "카톡 보내줘"라고 하면 채널 매니저에게 시켜야 하니까요)
    *   `WebSocket 서버`는 `에이전트`가 필요합니다.
*   **중앙 통제**: 만약 각자 따로 켜지면, "HTTP는 켜졌는데 DB가 안 켜지는" 끔찍한 상황이 발생합니다. `server.impl.ts`는 **모든 장기가 완벽하게 준비될 때까지 기다렸다가(await)**, 동시에 출격 명령을 내립니다.

---

### 2-9. 서버의 입, HTTP 서버 (`src/gateway/server-http.ts`) - **[단계 3: 호흡기 연결]**



안내 데스크(`server.ts`)와 사령부(`server.impl.ts`)가 준비되었습니다. 하지만 아직 이 서버는 **벙어리**입니다. 외부에서 말을 걸 수도, 대답할 수도 없습니다. 이제 **"입(Mouth)"** 을 달아줄 차례입니다.

> [!NOTE]
> **🤔 "입(Mouth)"의 진짜 역할은?**
> 
> **단순한 출력기가 아닙니다!** HTTP 서버는 **양방향 통신 장치**입니다:
> 
> 1. **입력 기능 (Request Listener)**:
>    - 외부에서 들어오는 모든 HTTP 요청(`GET`, `POST`, `PUT`, `DELETE`)을 **듣고(Listen)** 받아들입니다.
>    - 예: 웹훅(Slack, GitHub), API 호출(`/v1/chat/completions`), 브라우저 접속(`/ui`)
> 
> 2. **출력 기능 (Response Sender)**:
>    - 요청을 처리한 후 **응답(Response)**을 돌려보냅니다.
>    - 예: JSON 데이터, HTML 페이지, 상태 코드(200 OK, 404 Not Found)
> 
> 3. **숨겨진 핵심 기능들**:
>    - **라우팅(Routing)**: 요청 경로(`/health`, `/v1/hooks/agent`)에 따라 적절한 핸들러로 분배합니다.
>    - **인증(Authentication)**: 토큰 검증으로 허가된 요청만 처리합니다.
>    - **정적 파일 서빙**: 관리자 UI의 HTML/CSS/JS 파일을 제공합니다.
>    - **WebSocket 업그레이드**: HTTP 연결을 실시간 WebSocket으로 전환시킵니다.
>    - **에러 처리**: 잘못된 요청에 대해 적절한 에러 메시지를 반환합니다.
> 
> **비유**: 입은 단순히 "말하는" 기관이 아니라, **듣고(귀), 맛보고(센서), 씹고(처리), 말하는(출력)** 복합 기관입니다!

> [!NOTE]
> **🛠️ VS Code 실전 조립 절차**
> 1.  **파일 생성**: `src/gateway/server-http.ts` 파일을 생성합니다.
> 2.  **라이브러리 불러오기**: 상단에 `import { Hono } from "hono";`를 입력합니다. 만약 밑줄(Error)이 뜬다면 터미널에서 `pnpm add hono`가 되어있는지 확인하세요.
> 3.  **테스트**: 서버를 켠 후 브라우저 주소창에 `http://localhost:3000`을 입력해 "Hello!"가 나오는지 확인하는 것이 최종 목표입니다.


#### 2-9-1. [해부학] 입의 구조 (The Anatomy of the Mouth)
이 파일은 **Hono**라는 초고속 혀(Language)를 사용합니다.

*   **역할**: 들어오는 모든 HTTP 요청(`GET`, `POST`)을 듣고, 적절한 부서로 토스합니다.
*   **핵심 부품**:
    *   **Health Check**: "살아있니?" (`/health`) -> "응" (200 OK)
    *   **Webhooks**: "슬랙에서 메시지 왔어!" (`/v1/hooks/...`) -> 채널 매니저에게 전달
    *   **UI Assets**: "관리자 화면 보여줘" (`/ui`) -> HTML 파일 서빙

#### 2-9-2. [코드 분석] `createHttpServer` (입 만들기)

```typescript
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

export async function createHttpServer(params: {
  // 의존성 주입: 이 함수가 작동하기 위해 필요한 다른 부서 연락처들
  handleHooksRequest: any;  // 외부 훅 처리 담당자
  controlUiEnabled: boolean; // UI 켤지 말지 여부
}) {
  const app = new Hono();

  // 1. [기초 대사] 생존 신고 (Ping/Pong)
  // 가장 중요한 기능입니다. "나 살아있어요?"라고 물으면 "Pong" 해줍니다.
  // 클라우드(AWS, Fly.io)가 서버가 죽었는지 살았는지 찌러볼 때 씁니다.
  app.get("/health", (c) => c.text("ok"));

  // 2. [목소리] 관리자 UI 서빙
  // 사용자가 브라우저로 접속하면 이쁜 화면(HTML)을 보여줍니다.
  if (params.controlUiEnabled) {
    // "assets 폴더에 있는 파일 좀 보여줘" (정적 파일 서빙)
    app.use("/ui/*", serveStatic({ root: "./assets" }));
  }

  // 3. [귀] 외부 훅 듣기 (Listening Hooks)
  // Slack이나 다른 프로그램이 보내는 데이터를 받습니다.
  app.all("/v1/hooks/*", async (c) => {
    return params.handleHooksRequest(c); // 담당자에게 토스!
  });

  return { 
    app, // 완성된 입(Hono App)을 반환
  };
}
```

#### 2-9-3. [실습 가이드] 내 손으로 입 달아보기 (Hands-on Stub)

처음부터 완벽한 라우팅을 짤 필요는 없습니다. 일단 **"숨을 쉬는지"** 만 확인합시다.

1.  `src/gateway/server-http.ts` 파일을 만드세요.
2.  아래의 **최소 생존 훈련 코드**를 붙여넣으세요.

```typescript
import { Hono } from "hono";
import { narrate } from "../narrator";

export async function createHttpServer(params: any) {
  const app = new Hono();

  // "심장이 뜁니다."
  app.get("/", (c) => {
    narrate({ who: "HTTP", role: "입", action: "숨쉬기(Health Check)" });
    return c.text("OpenClaw Gateway: Breathing...");
  });

  return { app };
}
```

3.  이제 브라우저를 켜고 `http://localhost:18789` (포트는 설정에 따라 다름)에 접속했을 때, **"OpenClaw Gateway: Breathing..."** 이라는 글자가 보이면 성공입니다! 

> [!TIP]
> **🎉 축하합니다!**
> 
> 메시지가 나온다면 성공입니다!! **축하드립니다.** 여러분은 지금 **핵심 게이트웨이 알고리즘을 완성**하신 겁니다. 서버에 생명을 불어넣는 첫 번째 숨결을 성공적으로 만들어냈습니다!
>
> **다음 단계**: 이제 핵심 신경망 조직인 **귀 역할을 하는 WebSocket**을 만들어보도록 하겠습니다.


---

### 2-10. 서버의 귀, 실시간 통신망 (`src/gateway/server-ws-runtime.ts`) - **[단계 4: 청각 신경 연결]**

HTTP가 "필요할 때만 묻고 답하는" 방식이라면, WebSocket은 **"한번 연결되면 끊지 않고 계속 떠드는"** 방식입니다. 봇이 실시간으로 메시지를 받고 상태를 보고하려면 이 **"귀(Ears)"** 가 반드시 필요합니다.

> [!NOTE]
> **👂 "귀(WebSocket)"의 진짜 역할은?**
> 1. **실시간 감청 (Real-time Listening)**: 1초의 지연도 없이 메시지가 오는 즉시 낚아챕니다.
> 2. **양방향 무전기 (Full-Duplex)**: 서버가 클라이언트에게 먼저 말을 걸 수 있게 해줍니다. (HTTP는 이게 불가능합니다.)
> 3. **상태 동기화 (State Sync)**: "지금 봇이 타이핑 중입니다..." 같은 미세한 상태 변화를 즉시 전달합니다.

**파일 생성**: `src/gateway/server-ws-runtime.ts`

```typescript
import { narrate } from "../narrator.js";

// "귀" 핸들러 부착: 전화선(Socket)이 꽂히는 순간 작동합니다.
export function attachGatewayWsHandlers() {
    // 💡 실제 구현 시에는 wss.on("connection", ...) 이 들어갑니다.
    narrate({ 
        who: "WebSocket", 
        role: "귀", 
        action: "실시간 감청 시작 (Listening...)" 
    });
    
    console.log("👂 [Ears] 모든 실시간 소리를 들을 준비가 되었습니다.");
}
```

---

### 2-11. 서버의 팔다리, 외부 채널 관리자 (`src/gateway/server-channels.ts`) - **[단계 5: 사지 가동]**

머리(Brain)가 생각하고 입(HTTP)이 말해도, 정작 메시지를 보낼 **"팔다리(Limbs)"** 가 없으면 아무 일도 일어나지 않습니다. 이 파일은 WhatsApp, Slack 등의 외부 세계로 펀치를 날리는 역할을 합니다.

> [!NOTE]
> **💪 "팔다리(Channels)"의 진짜 역할은?**
> 1. **도구 선택 (Tooling)**: "이 메시지는 왓츠앱으로", "저 메시지는 슬랙으로" 보낼 도구를 집어듭니다.
> 2. **메시지 발송 (Dispatch)**: 텍스트를 실제 규격(JID 등)에 맞춰 발송합니다.
> 3. **연결 유지 (Keep-alive)**: 각 메신저 서비스와의 연결이 끊어지지 않게 관리합니다.

**파일 생성**: `src/gateway/server-channels.ts`

```typescript
import { narrate } from "../narrator.js";

export function createChannelManager() {
    narrate({ who: "ChannelManager", role: "팔다리", action: "근육 긴장 (Ready)" });

    return {
        // 메시지 쏘기 (펀치!)
        sendMessage: (msg: string) => {
            narrate({ 
                who: "ChannelManager", 
                role: "팔다리", 
                action: "메시지 발송 펀치 🥊", 
                friend: msg 
            });
            console.log(`[Limbs] 🚀 발송 완료: ${msg}`);
        },
        // 대사관 연결 (로그인 등)
        connect: () => {
            console.log("[Limbs] ✅ 모든 외부 대사관(WhatsApp)과 연결되었습니다.");
        }
    };
}
```


---

### 2-12. [확대 분석] 해설자 시스템 구현 (`src/narrator.ts`) - **[단계 6: 기록관 임명]**

"작동하는 코드가 아니라, **스스로 설명하는 코드**를 만드세요."

여러분이 작성할 마지막 부품이자, 사실상 가장 먼저 살아있어야 하는 도구입니다. 이 도구를 쓰면, 프로그램이 실행될 때마다 마치 영화 해설처럼 로그가 남습니다. 

> **💬 코치 코멘트**: "나중에 서버가 멈추거나 이상하게 작동할 때, 이 로그 기록만 추적하면 어떤 함수가 범인인지 즉시 색출해낼 수 있습니다. 시스템의 블랙박스 역할을 하는 셈이죠."

#### 2-12-1. [해부학] 해설자의 구성
*   **필드 설명**:
    *   **WHO**: 행동의 주인공 (함수 이름)
    *   **ROLE**: 주인공의 직함 (총사령관, 입, 귀 등)
    *   **ACTION**: 현재 수행 중인 임무
    *   **CONTACT**: 연결된 파트너 (선택 사항)

#### 2-12-2. [코드 분석] `narrate` 함수

```typescript
import fs from 'fs';

export function narrate(info: {
  who: string;
  role: string;
  action: string;
  friend?: string;
}) {
  const logMessage = `[${new Date().toISOString()}] 
  👤 WHO: ${info.who}
  🛡️ ROLE: ${info.role}
  🎬 ACTION: ${info.action}
  ${info.friend ? `🔗 CONTACT: ${info.friend}` : ""}
  --------------------------------------------------\n`;

  // 1. 현장 브리핑 (Console)
  console.log(logMessage);
  
  // 2. 사후 보고서 작성 (File)
  fs.appendFileSync('learning.log', logMessage);
}
```

#### 2-12-3. [Developer's Insight] 왜 이렇게까지 로그를 남기나요?
서버는 눈에 보이지 않는 유령과 같습니다. `narrate`는 그 유령이 어디서 무엇을 하는지 **시각화**해줍니다. 이 로그를 보는 습관을 들이면, 에러가 났을 때 "어디가 틀렸지?"가 아니라 "여기까지는 왔네!"라고 긍정적으로 접근할 수 있게 됩니다.

---

### 2-13. [통합 가이드] 6대 부품 조립 시 주의사항 (Common Pitfalls)

여러 부품을 한꺼번에 조립하다 보면 예상치 못한 사고가 발생할 수 있습니다. 시니어 개발자들이 겪었던 시행착오를 미리 확인하여 시간을 절약하세요.

> [!CAUTION]
> **🚨 조립 시 자주 발생하는 3대 사고**
> 
> 1. **"순서가 중요합니다" (Initialization Order)**:
>    - **증상**: `startGatewayServer`가 실행되자마자 에러가 나며 멈춥니다.
>    - **원인**: 설정을 불러오기(`loadConfig`) 전에 DB나 서버를 먼저 켜려고 했기 때문입니다.
>    - **해결**: 항상 **설정 -> 로깅 -> 내부 인프라 -> 통신망** 순서로 조립하세요.
> 
> 2. **"귀(WebSocket)가 들리지 않아요" (Port Conflict)**:
>    - **증상**: `EADDRINUSE` 에러가 나옵니다.
>    - **원인**: 이미 다른 프로그램(혹은 이전에 켰던 서버)이 같은 포트(18789)를 쓰고 있습니다.
>    - **해결**: 터미널에서 `lsof -i :18789`를 쳐서 범인을 찾고 `kill` 하거나, 포트 번호를 바꾸세요.
> 
> 3. **"임포트가 꼬였어요" (Circular Dependency)**:
>    - **증상**: `ReferenceError: Cannot access '...' before initialization`
>    - **원인**: A파일이 B를 가져오는데, B도 A를 가져올 때 발생합니다.
>    - **해결**: `server.ts`와 `server.impl.ts`를 분리한 이유가 바로 이것입니다! 복잡한 의존성은 항상 사령부(`impl`)로 몰아넣고, 외부에는 껍데기만 보여주세요.

---

### 🏁 Chapter 2를 마치며: "당신은 이제 사령관입니다"

축하합니다! 여러분은 방금 **가장 복잡하다는 게이트웨이 서버의 중추 신경망**을 모두 조립하셨습니다.

1.  **얼굴(`server.ts`)**: 손님을 맞이합니다.
2.  **뇌(`server.impl.ts`)**: 모든 부품을 지휘합니다.
3.  **입(`server-http.ts`)**: 웹과 소통합니다.
4.  **귀(`server-ws-runtime.ts`)**: 실시간으로 듣습니다.
5.  **팔다리(`server-channels.ts`)**: 실제 행동을 취합니다.
6.  **해설사(`narrator.ts`)**: 모든 과정을 기록합니다.

이제 이 6형제가 여러분의 명령 한 마디에 일사불란하게 움직이기 시작했습니다. 3장에서는 이 단단한 뼈대 위에 **"진짜 인공지능의 영혼"**을 불어넣는 과정을 다룰 것입니다.

> **💬 코치 코멘트**: "고생 많으셨습니다! 엔진 소리가 들리시나요? 이제 `npx tsx start.ts`를 눌러 여러분이 만든 서버의 첫 심장 박동을 감상해보세요. 이 짜릿한 순간이 바로 개발의 진짜 묘미랍니다!"

---

## Chapter 3. WhatsApp 채널 연결 (The Sense of Sight/Sound)

봇이 세상을 인식하는 **"눈과 귀"** 입니다. 여기서는 **WhatsApp**을 예로 들어, 외부 시스템과 어떻게 대화하는지 파헤쳐 보겠습니다.

### 3-1. [기술 해부] 왜 Baileys인가? (The Magic of Baileys)

보통 기업들이 봇을 만들 때는 페이스북(Meta)에서 제공하는 공식 "WhatsApp Business API"를 씁니다. 하지만 이건 유료이고, 승인 절차도 까다롭습니다. 

OpenClaw(Moltbot)이 선택한 **Baileys**는 다릅니다.
*   **원리**: 우리가 브라우저에서 'WhatsApp Web'을 켜서 QR 코드를 찍는 것과 **완전히 똑같은 방식**으로 동작합니다. 
*   **은유(Metaphor)**: **"투명 인간 브라우저"**. Baileys는 화면이 없는(Headless) 브라우저가 되어, 사용자 대신 키보드를 치고 화면을 읽는 역할을 합니다.

### 3-2. WhatsApp 어댑터 구현 (`src/channels/whatsapp.ts`)

이 코드는 단순한 통신 코드가 아니라, **"이질적인 언어를 통역하는 통역사"** 의 코드입니다.

#### 3-2-1. [코드 분석] `startWhatsAppChannel`

```typescript
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import { narrate } from "../narrator.js";

export async function startWhatsAppChannel(gateway: any) {
  narrate({ who: "WhatsAppChannel", role: "눈/귀", action: "세션 확인 중..." });

  // 1. [기억 장치] 세션 유지 (Session Persistence)
  // 매번 QR 코드를 찍으면 귀찮겠죠? 로그인 정보를 파일에 저장해둡니다.
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  // 2. [무전기 켜기] 소켓 연결
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // 터미널에 QR 코드를 띄웁니다.
  });

  // 3. [기억 업데이트] 로그인 정보가 바뀌면(새 토큰 등) 다시 저장합니다.
  sock.ev.on("creds.update", saveCreds);

  // 4. [경청하기] 새로운 메시지가 도착하면 (Upsert)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return; // 내용 없는 메시지는 무시

    narrate({ 
        who: "WhatsAppChannel", 
        role: "눈/귀", 
        action: "새 메시지 포착 👁️", 
        friend: msg.key.remoteJid 
    });

    // [중요] 데이터 정규화 (Normalization)
    // WhatsApp 특유의 복잡한 JSON을 Gateway가 이해할 수 있는 단순한 형태로 바꿉니다.
    const normalizedMsg = {
      from: msg.key.remoteJid, // 누가 보냈나?
      text: msg.message.conversation || msg.message.extendedTextMessage?.text, // 뭐라고 했나?
      timestamp: msg.messageTimestamp
    };

    // 5. [보고] Gateway 사령부에 알립니다.
    // "대장님! 밖에서 이런 메시지가 들어왔습니다!"
    gateway.emit("incoming_message", normalizedMsg);
  });
}
```



