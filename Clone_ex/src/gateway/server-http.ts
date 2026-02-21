import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { narrate } from "../narrator.js";

export async function createHttpServer(params: {
  controlUiEnabled: boolean;
  handleHooksRequest: (c: any) => Promise<any>;
}) {
  const app = new Hono();

  // [기초 대사] 생존 신고 (Ping/Pong)
  app.get("/health", (c) => {
    narrate({ who: "HTTP", role: "입", action: "숨쉬기(Health Check)" });
    return c.text("ok");
  });

  // [얼굴 서빙] 제어 패널 UI 서빙
  if (params.controlUiEnabled) {
    narrate({ who: "HTTP", role: "입", action: "제어 패널 UI 서빙 시작" });
    app.use("/*", serveStatic({ root: "./ui" }));
  }

  // [목소리] 기본 환영 메시지
  app.get("/", (c) => {
    narrate({ who: "HTTP", role: "입", action: "인사하기" });
    return c.text("OpenClaw Gateway: Breathing...");
  });

  // [귀] 외부 훅 듣기
  app.all("/v1/hooks/*", async (c) => {
    narrate({ who: "HTTP", role: "입", action: "외부 훅 수신", friend: "handleHooksRequest" });
    return params.handleHooksRequest(c);
  });

  return { app };
}
