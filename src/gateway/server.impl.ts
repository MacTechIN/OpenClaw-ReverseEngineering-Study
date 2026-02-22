import { narrate } from "../narrator.js";

export interface GatewayServer { /* 서버의 명함 정보 */ }

export async function startGatewayServer() {
    narrate({ who: "startGatewayServer", role: "총사령관", action: "시스템 기동 시작" });
    // 여기에 앞으로 HTTP, WS, Channel 부품들을 조립할 겁니다.
    console.log("🚀 Gateway Server is ready!");
}
