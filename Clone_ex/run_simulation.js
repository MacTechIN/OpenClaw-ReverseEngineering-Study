import EventEmitter from "events";

/**
 * [OpenClaw 통합 실행 시뮬레이션 - 최종 버전]
 * 환경 제약(EPERM)으로 인해 파일 기록(fs)을 제외하고 
 * 터미널 출력(console.log)만으로 모든 챕터의 통합 로직을 시연합니다.
 */

// --- Narrator (Chapter 2) ---
function narrate(info) {
  const logMessage = `[${new Date().toLocaleTimeString()}] 
  👤 WHO: ${info.who}
  🛡️ ROLE: ${info.role}
  🎬 ACTION: ${info.action}
  ${info.friend ? `🔗 CONTACT: ${info.friend}` : ""}
  --------------------------------------------------`;
  console.log(logMessage);
}

// --- AI Agent (Chapter 4) ---
async function runAgent(userInput) {
  narrate({ who: "runAgent", role: "지능형 뇌 (AI Agent)", action: "추론 시작", friend: userInput });
  
  // 생각하는 시간 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (userInput.includes("날씨")) {
    return "서울은 현재 맑음, 기온은 15도입니다. (AI 에이전트 도구 사용 결과)";
  }
  return "안녕하세요! 몰트봇입니다. 무엇을 도와드릴까요?";
}

// --- WhatsApp Channel (Chapter 3) ---
async function startWhatsAppChannel(gateway) {
  narrate({ who: "startWhatsAppChannel", role: "눈과 귀", action: "WhatsApp 가동" });
  
  console.log("... WhatsApp 연동 대기 중 (약 3초 후 가상 메시지가 도착합니다) ...");

  const simulateIncomingMessage = (from, text) => {
    narrate({ who: "WhatsApp", role: "귀", action: "새로운 외부 메시지 수신 (Normalization)", friend: from });
    gateway.emit("incoming_message", { from, text });
  };

  // 3초 후 가짜 메시지 발생
  setTimeout(() => simulateIncomingMessage("821012345678@s.whatsapp.net", "안녕! 몰트봇, 오늘 날씨 어때?"), 3000);

  return {
    sendMessage: async (jid, text) => {
      console.log(`\n[보내는 무전] To ${jid}: ${text}\n`);
      narrate({ who: "WhatsApp", role: "팔", action: "메시지 전송 완료", friend: jid });
    }
  };
}

// --- Main Loop (Chapters 2-4) ---
async function main() {
  console.log("\n========================================================");
  console.log("🚀 OpenClaw 통합 시뮬레이션 가동 (Chapters 1~5 통합)");
  console.log("========================================================\n");
  
  const gateway = new EventEmitter();
  
  // 가상 HTTP/WS 서버 비팅
  narrate({ who: "HTTP", role: "입", action: "Health Check 준비 완료" });
  narrate({ who: "WS-Server", role: "신경망", action: "대시보드 실시간 연결 대기 중" });

  const whatsapp = await startWhatsAppChannel(gateway);

  // 메시지 유입 시 처리 루프
  gateway.on("incoming_message", async (msg) => {
    narrate({ who: "Brain", role: "지휘소", action: "메시지 전달받음 -> AI에게 전달", friend: msg.from });

    // AI 에이전트 실행
    const reply = await runAgent(msg.text);

    // 응답 전송
    await whatsapp.sendMessage(msg.from, reply);
    
    console.log("\n========================================================");
    console.log("🎉 성공: 시뮬레이션이 모두 정상적으로 끝났습니다!");
    console.log("========================================================\n");
    process.exit(0);
  });
}

main();
