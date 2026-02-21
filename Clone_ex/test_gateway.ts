import { startGatewayServer } from "./src/gateway/server.js";

async function main() {
  console.log("--- Starting Gateway Server Test ---");
  const server = await startGatewayServer(3000, { controlUiEnabled: true });
  
  // Wait a bit to simulate running (Chapter 3/4 flow takes ~7s)
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log("--- Shutting down Gateway Server ---");
  await server.close({ reason: "Test finished" });
}

main().catch(err => {
  console.error("Test failed:", err);
});
