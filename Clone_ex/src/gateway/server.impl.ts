import { narrate } from "../narrator.js";
import { createHttpServer } from "./server-http.js";
import { attachGatewayWsHandlers } from "./server-ws-runtime.js";
import { createChannelManager } from "./server-channels.js";
import { startWhatsAppChannel } from "../channels/whatsapp.js";
import { runAgent } from "../agents/pi-embedded-runner.js";
import EventEmitter from "events";

export type GatewayServerOptions = {
  controlUiEnabled?: boolean;
};

export type GatewayServer = {
  close: (opts?: { reason?: string; restartExpectedMs?: number | null }) => Promise<void>;
};

export async function startGatewayServer(
  port = 18789,
  opts: GatewayServerOptions = {},
): Promise<GatewayServer> {
  narrate({ 
    who: "startGatewayServer", 
    role: "총사령관 (Brain)", 
    action: "서버 기동 시퀀스 시작" 
  });

  // 1. 게이트웨이 이벤트 허브 생성
  const gateway = new EventEmitter();

  // 2. 장기(Subsystems) 조립
  const channelManager = createChannelManager();
  
  // 3. HTTP 서버(Mouth) 기동
  const { app } = await createHttpServer({
    controlUiEnabled: !!opts.controlUiEnabled,
    handleHooksRequest: async (c) => {
      console.log("[Brain] Handling hook request...");
      return c.text("Hook handled");
    }
  });

  // 4. WebSocket(Ears) 설정을 위한 가짜 EventEmitter
  const wss = new EventEmitter();
  
  attachGatewayWsHandlers({
    wss,
    clients: new Set(),
    broadcast: (msg) => console.log(`[Brain] Broadcast: ${msg}`)
  });

  // 5. WhatsApp(Eyes/Ears) 연결 및 핸들러 등록
  const whatsapp = await startWhatsAppChannel(gateway);

  // [신경망 핵심] 메시지 유입 시 AI 에이전트 실행 로직
  gateway.on("incoming_message", async (msg: any) => {
    narrate({ 
      who: "Brain", 
      role: "지휘소", 
      action: "WhatsApp 메시지 수신 -> AI 분석 의뢰", 
      friend: msg.from 
    });

    // AI 에이전트 실행
    const reply = await runAgent(msg.text);

    // AI의 답변을 다시 WhatsApp으로 전송
    await whatsapp.sendMessage(msg.from, reply);
  });

  narrate({ 
    who: "startGatewayServer", 
    role: "총사령관", 
    action: "모든 시스템(HTTP, WS, WhatsApp, Agent) 준비 완료", 
    friend: "Full-Integration-Ready" 
  });

  console.log(`🚀 Gateway Server is ready for action on port ${port}!`);

  return {
    close: async (opts) => {
      narrate({ 
        who: "close", 
        role: "총사령관", 
        action: "서버 안전 종료", 
        friend: opts?.reason || "User Request" 
      });
      console.log("🛑 Gateway Server shut down safely.");
    },
  };
}
