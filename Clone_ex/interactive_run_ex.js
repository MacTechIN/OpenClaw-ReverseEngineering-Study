import EventEmitter from "events";

/**
 * [OpenClaw Clone_ex 대화형 시뮬레이터]
 * 각 단계별로 시스템의 작동 원리를 설명하며 실행됩니다.
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function stepHeader(stepNum, title, description) {
  console.log("\n" + "=".repeat(60));
  console.log(`[STEP ${stepNum}] ${title}`);
  console.log("-".repeat(60));
  console.log(`💡 목적: ${description}`);
  console.log("=".repeat(60) + "\n");
  await sleep(2000);
}

function narrate(info) {
  console.log(`   [Log] 👤 ${info.who.padEnd(10)} | 🛡️ ${info.role.padEnd(12)} | 🎬 ${info.action}`);
}

async function runInteractiveSimulation() {
  console.log("\n" + "★".repeat(60));
  console.log("   OpenClaw(Moltbot) 통합 시스템 단계별 시연 시작");
  console.log("   본 시연은 Chapters 1-5의 모든 핵심 로직을 포함합니다.");
  console.log("★".repeat(60) + "\n");
  await sleep(2000);

  // --- Step 1: Foundation ---
  await stepHeader(1, "기초 공사 및 신경망 초기화 (Core & Nerve)", "시스템의 뼈대와 로그를 기록할 신경망을 구축합니다.");
  const gateway = new EventEmitter();
  narrate({ who: "System", role: "Infrastructure", action: "EventEmitter(신경망) 생성 완료" });
  narrate({ who: "Narrator", role: "신경계", action: "로그 추적 시스템 가동" });
  await sleep(2000);

  // --- Step 2: Mouth & Ears ---
  await stepHeader(2, "입(HTTP)과 귀(WS) 개방", "외부 세계(브라우저, 관리자)와 소통할 통로를 엽니다.");
  narrate({ who: "HTTP Server", role: "입 (Mouth)", action: "Port 18789 리스닝 시작 (Hono 기반)" });
  narrate({ who: "WS Runtime", role: "귀 (Ears)", action: "실시간 대시보드 연결 대기 상태 진입" });
  await sleep(2000);

  // --- Step 3: Eyes & Ears (WhatsApp) ---
  await stepHeader(3, "오감(Sensors) 활성화: WhatsApp 연동", "실제 외부 사용자의 메시지를 감지할 센서를 가동합니다.");
  narrate({ who: "WhatsApp", role: "눈과 귀", action: "메신저 인증 정보 로드 및 서버 연결 성공" });
  console.log("   [알림] 이제 시스템은 외부로부터의 자극(메시지)을 기다립니다...");
  await sleep(3000);

  // --- Step 4: Incoming Message ---
  await stepHeader(4, "자극 발생: 메시지 수신 (Input)", "외부 사용자로부터 실제 질문이 도착했습니다.");
  const incomingMsg = {
    from: "821012345678@s.whatsapp.net",
    text: "안녕 몰트봇! 오늘 서울 날씨가 어때?",
    platform: "whatsapp"
  };
  narrate({ who: "WhatsApp", role: "감각 센서", action: "새 메시지 감지 및 표준화(Normalization)" });
  narrate({ who: "Gateway", role: "신경 경로", action: "브레인(Brain)으로 데이터 패킷 전송" });
  await sleep(2000);

  // --- Step 5: Brain Processing ---
  await stepHeader(5, "브레인 가동: AI 에이전트 추론 (Think)", "수신된 텍스트의 의도를 분석하고 답변을 설계합니다.");
  narrate({ who: "AI Agent", role: "지능형 뇌", action: "의도 분석 중... [서울], [날씨] 키워드 포착" });
  await sleep(1500);
  narrate({ who: "AI Agent", role: "지능형 뇌", action: "내부 날씨 도구(Tool) 호출 및 결과 생성" });
  const aiReply = "현재 서울의 기온은 15도이며 맑은 하늘입니다. 산책하기 아주 좋은 날씨네요! ☀️";
  await sleep(1500);

  // --- Step 6: Limbs Action ---
  await stepHeader(6, "운동 기능: 답변 전송 (Output)", "뇌의 명령을 받아 팔다리가 실제로 응답을 보냅니다.");
  narrate({ who: "ChannelMgr", role: "운동 신경", action: "답변 패킷을 WhatsApp 팔로 전달" });
  console.log(`\n   >>> [WhatsApp 전송 완료] To: ${incomingMsg.from}`);
  console.log(`   >>> [내용]: ${aiReply}\n`);
  narrate({ who: "WhatsApp", role: "팔 (Limbs)", action: "메시지 발송 성공 시그널 확인" });
  await sleep(2000);

  // --- Final Summary ---
  console.log("\n" + "=".repeat(60));
  console.log("   🎉 OpenClaw Clone_ex 시연 완료!");
  console.log("-".repeat(60));
  console.log("   1. 기초(Nerve) -> 2. 통로(Gateway) -> 3. 인지(Sensor)");
  console.log("   4. 추론(Brain) -> 5. 실행(Limbs)의 전 과정이 검증되었습니다.");
  console.log("=".repeat(60) + "\n");
}

runInteractiveSimulation().catch(console.error);
