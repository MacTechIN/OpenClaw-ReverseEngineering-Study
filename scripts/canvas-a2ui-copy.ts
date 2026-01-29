import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(repoRoot, "src", "canvas-host", "a2ui");
const outDir = path.join(repoRoot, "dist", "canvas-host", "a2ui");

async function main() {
  const shouldSkip =
    process.env.CLAWDBOT_A2UI_SKIP_MISSING === "1" ||
    process.env.CLAWDBOT_A2UI_SKIP_MISSING === "true";

  try {
    await fs.stat(path.join(srcDir, "index.html"));
    await fs.stat(path.join(srcDir, "a2ui.bundle.js"));
  } catch (error) {
    if (shouldSkip) {
      console.warn(
        "[canvas-a2ui-copy] Skipping A2UI asset copy (CLAWDBOT_A2UI_SKIP_MISSING is set). UI features may be limited."
      );
      return;
    }
    throw error;
  }

  await fs.mkdir(path.dirname(outDir), { recursive: true });
  await fs.cp(srcDir, outDir, { recursive: true });
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
