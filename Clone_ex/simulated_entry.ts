import { narrate } from "./src/narrator.js";
import { runAgent } from "./src/agents/pi-embedded-runner.js";
import { startWhatsAppChannel } from "./src/channels/whatsapp.js";
import { createChannelManager } from "./src/gateway/server-channels.js";
import { attachGatewayWsHandlers } from "./src/gateway/server-ws-runtime.js";
import EventEmitter from "events";

/**
 * [OpenClaw 통합 실행 시뮬레이션]
 * 환경 제약으로 인해 외부 라이브러리(Hono 등) 없이 
 * 우리가 구현한 모든 챕터의 핵심 로직을 연결하여 실행합니다.
 */
async function simulateFullProject() {
  narrate({ 
    who: "Simulation", 
    role: "System Boot", 
    action: "=== OpenClaw Clone_ex 통합 시뮬레이션 시작 ===" 
  });

  // 1. 게이트웨이 이벤트 허브 (신경망 중심)
  const gateway = new EventEmitter();

  // 2. 장기(Subsystems) 조립
  const channelManager = createChannelManager();
  
  // 3. HTTP 서버 (입) - 시뮬레이션에서는 로그로만 표시
  narrate({ who: "HTTP", role: "입", action: "가상 서버 리스닝 시작 (Port 18789)" });

  // 4. WebSocket (귀) - 시뮬레이션에서는 가짜 핸들러 사용
  const wssMock = new EventEmitter();
  attachGatewayWsHandlers({
    wss: wssMock,
    clients: new Set(),
    broadcast: (msg) => console.log(`[Simulation-WS] Broadcast: ${msg}`)
  });

  // 5. WhatsApp (눈/귀) 연결
  // 이 함수 내부에서 5초 후 가짜 메시지를 발생시키도록 되어 있습니다.
  const whatsapp = await startWhatsAppChannel(gateway);

  // [신경망 핵심 로직] 메시지 유입 시 처리 흐름
  gateway.on("incoming_message", async (msg: any) => {
    narrate({ 
      who: "Brain", 
      role: "지휘소", 
      action: "WhatsApp으로부터 메시지 수신 -> 분석 시작", 
      friend: msg.from 
    });

    // AI 에이전트 실행 (Brain 추론)
    const reply = await runAgent(msg.text);

    // 응답 전송 (Limbs 동작)
    await whatsapp.sendMessage(msg.from, reply);

    narrate({ 
      who: "Simulation", 
      role: "System", 
      action: "전체 메시지 처리 루프 완료", 
      friend: "Success" 
    });

    console.log("\n시뮬레이션이 성공적으로 종료되었습니다.");
    process.exit(0);
  });

  console.log("\n🚀 OpenClaw 시스템 가동 중... (WhatsApp 가상 메시지 대기 중: 5초)");
}

simulateFullProject().catch(err => {
  console.error("시뮬레이션 오류:", err);
  process.exit(1);
});
