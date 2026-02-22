import { Hono } from "hono";

export function createHttpServer() {
    const app = new Hono();
    app.get("/", (c) => c.text("Hello! This is Gateway."));
    return app;
}
