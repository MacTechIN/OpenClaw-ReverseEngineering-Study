# 프로젝트 구조 및 아키텍처 분석

이 문서는 `moltbot` (Clawdbot) 프로젝트의 구조, 주요 구성 요소, 그리고 이들이 어떻게 연결되어 작동하는지를 설명합니다.

## 1. 프로젝트 개요

**Clawdbot**은 WhatsApp, Slack, Telegram 등 다양한 메신저 플랫폼을 통합 관리하는 **Gateway CLI**이자, AI 에이전트(Pi Agent)를 구동하는 플랫폼입니다. Node.js 기반의 Monorepo 구조로 되어 있으며, 확장성(Extensions)과 다양한 클라이언트 앱(iOS, Android, macOS)을 지원합니다.

## 2. 디렉토리 구조 (Directory Structure)

주요 디렉토리의 역할은 다음과 같습니다.

*   **`src/`**: 핵심 소스 코드가 위치합니다. (CLI, Gateway, Agent 로직 등)
*   **`apps/`**: 각 플랫폼별 네이티브 앱 래퍼(Wrapper)나 클라이언트가 위치합니다.
    *   `ios/`, `android/`, `macos/`: 모바일 및 데스크탑 앱 프로젝트.
*   **`ui/`**: 웹 기반의 제어 UI (Control UI) 프로젝트 (Vite + Lit).
*   **`extensions/`**: 봇의 기능을 확장하는 플러그인들이 위치하는 공간.
*   **`scripts/`**: 빌드, 테스트, 배포 등 개발 편의를 위한 스크립트 모음.
*   **`dist/`**: 빌드된 결과물이 저장되는 디렉토리 (`package.json`의 main 진입점).

## 3. 주요 구성 요소 및 역할 (Key Components)

이 프로젝트는 크게 **CLI**, **Gateway**, **Agent**, **Channels**로 나눌 수 있습니다.

### 3.1. CLI (`src/cli`, `src/entry.ts`)
*   **역할**: 프로그램의 시작점(Entry Point)입니다.
*   **작동 방식**: 사용자가 터미널에서 `clawdbot` 명령어를 실행하면 `src/entry.ts`가 실행되고, 이는 `src/cli/run-main.ts`를 호출하여 명령어(gateway, agent, tui 등)를 파싱하고 적절한 모듈을 실행합니다.
*   **왜 필요한가?**: 서버 실행, 에이전트 관리, 설정 변경 등 다양한 기능을 하나의 인터페이스로 제공하기 위함입니다.

### 3.2. Gateway (`src/gateway`)
*   **역할**: 봇의 **중추 신경계** 역할을 하는 서버입니다.
*   **작동 방식**: `src/gateway/server.impl.ts`에서 시작되며, 설정된 **채널(Channels)**을 초기화하고 외부 메신저와 연결을 맺습니다. 들어오는 메시지를 받아 에이전트에게 전달하고, 에이전트의 응답을 다시 메신저로 보냅니다.
*   **왜 필요한가?**: 다양한 메신저 플랫폼(WhatsApp, Slack 등)의 상이한 프로토콜을 추상화하여, 에이전트가 플랫폼에 상관없이 동일한 방식으로 대화할 수 있게 합니다.

### 3.3. Channels (`src/channels`, `src/whatsapp`, `src/slack` 등)
*   **역할**: 특정 메신저 플랫폼과의 통신을 담당하는 어댑터입니다.
*   **연결**: Gateway에 의해 로드되며, 각 플랫폼의 API(예: Baileys for WhatsApp)를 사용하여 메시지를 송수신합니다.
*   **왜 필요한가?**: 플랫폼별 고유한 인증 방식, 메시지 포맷 등을 처리하기 위해 특화된 모듈이 필요합니다.

### 3.4. Agents (`src/agents`)
*   **역할**: 실제 "지능"을 담당하는 AI 로직입니다. (Pi Agent)
*   **작동 방식**: LLM(Large Language Model)과 연동하여 사용자의 메시지를 이해하고, 도구(Tools)를 사용하거나 답변을 생성합니다. `pi-embedded-runner.ts` 등이 핵심 실행기입니다.
*   **왜 필요한가?**: 단순한 규칙 기반 봇이 아닌, 문맥을 이해하고 복잡한 작업을 수행하는 AI 기능을 제공하기 위함입니다.

### 3.5. UI (`ui/`)
*   **역할**: 사용자가 봇의 상태를 확인하고 설정을 제어할 수 있는 웹 인터페이스입니다.
*   **연결**: Gateway가 실행될 때 함께 서빙되거나 별도로 접속할 수 있습니다.

## 4. 데이터 흐름 및 상호작용 (Architecture Flow)

전체적인 작업 흐름은 다음과 같습니다.

1.  **시작**: 사용자가 `clawdbot gateway` 명령어를 실행합니다.
2.  **초기화**: CLI가 Gateway 서버(`src/gateway`)를 시작합니다.
3.  **연결**: Gateway가 설정파일을 읽고 필요한 **Channel**(예: WhatsApp)을 로드하여 로그인합니다.
4.  **수신**: WhatsApp에서 메시지가 오면 **Channel**이 이를 감지하고 Gateway로 전달합니다.
5.  **처리**: Gateway는 이 메시지를 **Agent**(`src/agents`)에게 넘깁니다.
6.  **추론**: Agent는 LLM을 통해 답변을 생각하거나, 필요한 작업(예: 검색, 스케줄 등록)을 수행합니다.
7.  **응답**: Agent가 생성한 답변은 다시 Gateway를 거쳐 **Channel**로 전달되고, 최종적으로 사용자에게 메시지로 전송됩니다.

## 5. 결론

이 프로젝트는 **확장성**과 **통합**에 중점을 둔 아키텍처를 가지고 있습니다. Gateway를 중심으로 다양한 플랫폼(메신저)과 지능(AI)을 플러그인 형태로 연결할 수 있어, 새로운 메신저를 추가하거나 새로운 AI 기능을 도입하기 용이한 구조입니다.
