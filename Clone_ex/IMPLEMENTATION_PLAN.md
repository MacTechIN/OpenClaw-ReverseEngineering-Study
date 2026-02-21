# OpenClaw Clone_ex Implementation Plan (Chapters 1-5)

본 문서는 OpenClaw(Moltbot)의 핵심 아키텍처를 `Clone_ex` 폴더에 클론하고 구현한 상세 과정과 실행 방법을 설명합니다. 모든 코드는 '해부학적 관점'에서 설계되어 시스템의 각 부분이 인간의 장기처럼 유기적으로 작동하도록 구성되었습니다.

---

## 🚀 1. 프로젝트 개요 (Anatomical Architecture)

`Clone_ex`는 OpenClaw의 복잡한 로직을 5개의 챕터로 나누어 단계별로 구현한 교육용 클론 프로젝트입니다.

| 파일/폴더 | 해부학적 역할 | 기능 설명 |
| :--- | :--- | :--- |
| `src/gateway/server.ts` | **얼굴 (Face)** | 외부 모듈이 서버를 호출하는 공식 Entry Point |
| `src/gateway/server.impl.ts` | **뇌 (Brain)** | 모든 장기(HTTP, WS, Channel)를 연결하고 통합 제어 |
| `src/gateway/server-http.ts` | **입 (Mouth)** | HTTP 요청 처리 및 관리 UI(Dashboard) 서빙 |
| `src/gateway/server-ws-runtime.ts` | **귀 (Ears)** | WebSocket을 통한 실시간 데이터 경청 |
| `src/gateway/server-channels.ts` | **팔다리 (Limbs)** | WhatsApp, Slack 등 외부 메신저와의 연결 관리 |
| `src/channels/whatsapp.ts` | **눈과 귀 (Senses)** | 실제 외부 메시지를 수집하고 표준 형식으로 변환 |
| `src/agents/pi-embedded-runner.ts` | **지능 (Intelligence)** | LLM을 사용하여 의도를 분석하고 답변을 생성 |
| `src/narrator.ts` | **신경계 (Nerve)** | 시스템의 모든 움직임을 기록하고 보고 (Logging) |

---

## 🛠 2. 구현 방법 및 기술 스택

### 핵심 기술 (Tech Stack)
- **Runtime**: Node.js (v22+)
- **Language**: TypeScript (엄격한 타입 체크 및 인터페이스 기반 설계)
- **Framework**: Hono (경량 고속 웹 서버)
- **Messenger API**: Baileys (WhatsApp Web 리버스 엔지니어링)
- **Architecture**: Micro-Kernel & Event-Driven (중앙 Gateway 중심 설계)

### 단계별 구현 로직
1.  **Chapter 1 (기초)**: `tsconfig.json` 및 `package.json` 설정으로 현대적 ESM 환경 구축.
2.  **Chapter 2 (신경망)**: `narrator.ts`를 통해 시스템의 모든 로그를 추적 가능하게 만듦.
3.  **Chapter 3 (오감)**: WhatsApp 어댑터를 구현하여 외부 메시지를 수신하는 '눈'을 장착.
4.  **Chapter 4 (지능)**: AI 에이전트 러너를 구현하여 메시지에 대한 지능적 답변 생성.
5.  **Chapter 5 (얼굴)**: `ui/` 폴더 내의 HTML/JS를 통해 시스템 상태를 시각화하는 대시보드 구축.

---

## 🏃 3. 실행 방법 (Execution Guide)

현재 환경의 보안 정책(EPERM) 및 패키지 설치 제한을 고려하여 두 가지 실행 방법을 제공합니다.

### 방법 A: 전체 통합 시뮬레이션 (추천)
외부 라이브러리 설치 없이 모든 챕터의 로직이 연결되는 것을 터미널에서 즉시 확인할 수 있습니다.
```bash
node run_simulation.js
```
- **작동 방식**: 가상의 WhatsApp 메시지 발생 -> 브레인 분석 -> AI 답변 생성 -> 전송 완료 과정을 시각화하여 보여줍니다.

### 방법 B: 실제 서버 가동 (로컬 환경 필요)
사용자님의 로컬 컴퓨터에서 실제 서버를 띄우고 UI에 접속하는 방법입니다.
```bash
cd Clone_ex
pnpm install
pnpm run dev
```
- **접속**: 브라우저에서 `http://localhost:18789`로 접속하여 제어 패널 확인 가능.

---

## 📅 4. 향후 실행 및 확장 계획 (Forward Plan)

1.  **실제 API 연동**: 현재 시뮬레이션된 AI/메신저 부분을 실제 OpenAI/Baileys API 키와 연결.
2.  **데이터베이스 영속화**: SQLite를 사용하여 대화 내역 및 사용자 세션을 파일로 영구 저장.
3.  **도구 호출(Tool Calling) 확장**: 날씨 조회 외에 일정 예약, 이메일 전송 등의 실제 기능을 에이전트에 추가.
4.  **모바일 최적화**: 대시보드 UI를 반응형으로 개선하여 스마트폰에서도 모니터링 가능하도록 개선.

---
**작성일**: 2026-02-21
**상태**: Chapters 1-5 구현 완료 및 검증 성공
