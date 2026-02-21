import { startGatewayServer } from "./gateway/server.js";
import { narrate } from "./narrator.js";

async function run() {
  narrate({ 
    who: "Main", 
    role: "System Boot", 
    action: "OpenClaw Clone_ex 시작" 
  });

  const port = 18789;
  const server = await startGatewayServer(port, { controlUiEnabled: true });

  console.log(`
  =========================================
  🚀 OpenClaw Clone_ex 가동 중!
  📡 포트: ${port}
  📂 로그: learning.log
  =========================================
  `);

  // 프로세스 종료 시 서버 안전 종료
  process.on('SIGINT', async () => {
    console.log("\n종료 신호를 받았습니다...");
    await server.close({ reason: "Process interrupted" });
    process.exit(0);
  });
}

run().catch(err => {
  console.error("실행 중 오류 발생:", err);
  process.exit(1);
});
