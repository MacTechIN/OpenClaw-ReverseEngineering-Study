# Moltbot (Clawdbot) Recreation Prompts for Google Antigravity

This document contains a sequential list of prompts to command Google Antigravity to recreate the Moltbot project structure and core functionality. Assumes you are starting with an empty repository.

## Phase 1: Project Initialization & Configuration

**Prompt 1: Initialize Monorepo Structure**
> Create a new Node.js monorepo project named `moltbot` (or `clawdbot`).
> 1.  Initialize `package.json` with `pnpm` as the package manager (version 10.23.0).
> 2.  Create `pnpm-workspace.yaml` with packages: `.`, `ui`, `extensions/*`.
> 3.  Create key root configuration files:
>     *   `tsconfig.json` (base TypeScript config).
>     *   `.gitignore` (standard Node/Mac ignores).
>     *   `.npmrc` (strict peer dependencies).
> 4.  Set up the `scripts` directory and creating `scripts/run-node.mjs` for executing TypeScript files via `tsx` or `node`.

**Prompt 2: Root Dependencies & Scripts**
> Update the root `package.json` to include the following scripts and dependencies:
> *   **Scripts**: `dev`, `build`, `lint`, `test`, `start` (refer to standard monorepo patterns).
> *   **Dependencies**: `express` (for gateway), `ws` (websocket), `zod` (validation), `@mariozechner/pi-agent-core` (or similar core libs if available/mocked), `typescript`, `tsx`, `vitest` (for testing).
> *   **Note**: Ensure `files` array includes `dist/`, `docs/`, `extensions/`.

---

## Phase 2: Core Infrastructure (`src/config` & `src/infra`)

**Prompt 3: Configuration Module**
> Create the configuration module in `src/config`:
> 1.  `src/config/schema.ts`: Define the Zod schema for the entire bot configuration (Gateway, Agents, Models, Channels).
> 2.  `src/config/config.ts`: Implement functions to load, validate, and write `clawdbot.json`.
> 3.  `src/config/defaults.ts`: Define default configuration values.
> 4.  Implement environment variable substitution logic in `src/config/env-substitution.ts`.

**Prompt 4: Infrastructure Utilities**
> Create infrastructure utilities in `src/infra` and `src/logging`:
> 1.  `src/logging/subsystem.ts`: Create a logger factory (using `tslog` or similar) supporting sub-system tags (gateway, agent, etc.).
> 2.  `src/infra/path-env.ts`: Helper to resolve CLI paths.
> 3.  `src/infra/heartbeat-runner.ts`: Implement a heartbeat mechanism to check system status periodically.

---

## Phase 3: Gateway Server (The "Brain")

**Prompt 5: Gateway Entry Point & Types**
> Create the Gateway Server skeleton in `src/gateway`:
> 1.  `src/gateway/server.impl.ts`: Implement `startGatewayServer(port, options)` function. It should initialize the logger, config, and node registry.
> 2.  `src/gateway/server.ts`: Export the public API for the gateway.
> 3.  `src/entry.ts`: The main CLI entry point. It should parse arguments and call `startGatewayServer`.

**Prompt 6: Node Registry & WebSocket**
> Implement the Node Registry and WebSocket handling:
> 1.  `src/gateway/node-registry.ts`: A class to manage connected nodes (peers) and manage their state/presence.
> 2.  `src/gateway/server-ws-runtime.ts`: Implement WebSocket message handling. Handle events like `auth`, `subscribe`, `message`, `heartbeat`.
> 3.  Integrate `ws` server in `startGatewayServer` to listen on the specified port.

---

## Phase 4: AI Agents & Runner

**Prompt 7: Agent System Prompt**
> Create the Agent System Prompt generator in `src/agents/system-prompt.ts`.
> Implement `buildAgentSystemPrompt(params)` which returns a markdown string.
> It needs to dynamically include sections for:
> *   **Tooling**: List available tools (`read`, `exec`, `web_search`...) with descriptions.
> *   **Workspace**: Current working directory context.
> *   **Messaging**: Instructions on how to reply (Silent Token, Reply Tags).
> *   **Runtime**: Info about the current OS and environment.

**Prompt 8: Embedded Agent Runner**
> Create `src/agents/pi-embedded-runner.ts` to manage the AI execution loop.
> 1.  Implement `runEmbeddedPiAgent(session, context)`:
> 2.  It should fetch the history, build the system prompt, call the LLM (mock or real adapter), and handle Tool Calls.
> 3.  Implement Tool Execution Sandbox logic (or a placeholder for it) ensuring safe execution of `exec` and `fs` commands.

---

## Phase 5: Channels (Adapters)

**Prompt 9: Channel Interface & Base**
> Create `src/channels/channels.ts` defining the `Channel` interface (start, stop, sendMessage).
> Create a base channel class in `src/channels/shared.ts` to handle common logging and status updates.

**Prompt 10: WhatsApp & Slack Adapters**
> Implement example channel adapters:
> 1.  `src/channels/whatsapp.ts`: Use `@whiskeysockets/baileys` to implement a WhatsApp client. Connect message events to the Gateway's event bus.
> 2.  `src/channels/slack.ts`: Use `@slack/bolt` to implement a Slack bot adapter.
> *   Ensure both adapters map native message events to the internal `Message` type.

---

## Phase 6: UI (Frontend)

**Prompt 11: UI Project Setup**
> Initialize the `ui/` directory as a separate Vite + Lit project.
> 1.  Create `ui/package.json` and `ui/vite.config.ts`.
> 2.  Create `ui/index.html` as the entry point.
> 3.  Create `ui/src/main.ts` which imports styles and the main app component.

**Prompt 12: UI Components (Lit)**
> Create the core UI components in `ui/src/ui`:
> 1.  `app.ts`: The main `<app-root>` component managing the layout (Sidebar, Chat, Settings).
> 2.  `views/chat.ts`: A chat view component rendering the message list and input box.
> 3.  `controllers/gateway-connection.ts`: A WebSocket client controller to connect to the Gateway Server and sync state.

---

## Phase 7: CLI & Scripts

**Prompt 13: CLI Commands**
> Create the CLI command definitions in `src/cli`:
> 1.  `src/cli/program.ts`: Define the `Commander` program.
> 2.  `src/cli/gateway-cli.ts`: Implement `gateway start`, `gateway status` commands.
> 3.  `src/cli/agent-cli.ts`: Implement `agent run` command to run an agent loop locally.

**Prompt 14: Build & Release Scripts**
> Recreate key scripts in `scripts/`:
> 1.  `scripts/package-mac-app.sh`: Script to bundle the app for macOS.
> 2.  `scripts/docker-setup.sh`: Script to set up the Docker sandbox environment.
> 3.  `scripts/postinstall.js`: Handle post-install tasks like patching dependencies.

---

## Phase 8: Mobile Apps (Optional/Native)

**Prompt 15: iOS App Structure**
> Create the iOS project structure in `apps/ios`.
> 1.  Initialize an Xcode project or use `xcodegen` with `project.yml`.
> 2.  Create a Swift View that connects to the Gateway WebSocket.
> 3.  Implement `ViewModel` to handle authentication and message state.

**Prompt 16: Android App Structure**
> Create the Android project structure in `apps/android`.
> 1.  Initialize a Gradle project.
> 2.  Create a `MainActivity` in Kotlin.
> 3.  Implement a simple WebSocket client service to communicate with the Gateway.
