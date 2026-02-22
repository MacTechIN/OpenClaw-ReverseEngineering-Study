// OpenClaw Foundation Test File
// This file verifies that the TypeScript environment is correctly set up.

import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("OpenClaw Gateway is ready!"));

console.log("Foundations are solid. Moving to Chapter 2!");

export default app;
