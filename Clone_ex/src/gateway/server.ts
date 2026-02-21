// [1] 명함(Type) 공유 (Public Card)
export type { GatewayServer, GatewayServerOptions } from "./server.impl.js";

// [2] 사장실 연결 (The Real Boss)
// 핵심: 실제로 서버를 켜는 함수(startGatewayServer)를 밖으로 내보냅니다.
export { startGatewayServer } from "./server.impl.js";
