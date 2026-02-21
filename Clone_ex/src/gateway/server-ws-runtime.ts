import { narrate } from "../narrator.js";

export function attachGatewayWsHandlers(params: {
  wss: any;
  clients: any;
  broadcast: (msg: any) => void;
}) {
  // WebSocket 연결이 들어오면 "누구세요?" 하고 듣는 로직이 들어갑니다.
  narrate({ 
    who: "attachGatewayWsHandlers", 
    role: "통신병", 
    action: "실시간 메시지 수신 대기 시작 (Ears)" 
  });

  params.wss.on("connection", (ws: any) => {
    narrate({ 
      who: "WsHandler", 
      role: "통신병", 
      action: "새로운 실시간 연결 수락" 
    });
    
    ws.on("message", (message: any) => {
      console.log(`[Ears] Received: ${message}`);
    });
  });
}
