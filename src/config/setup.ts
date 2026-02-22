import { input, confirm } from "@inquirer/prompts";
import { mkdirSync, writeFileSync } from "node:fs";
import { getConfigDir, getConfigFilePath } from "./paths.js";

export async function runSetup(): Promise<void> {
  console.log("\n  discord-webhook-mcp setup\n");

  const webhookUrl = await input({
    message: "Discord Webhook URL:",
    validate: (v) =>
      v.startsWith("https://discord.com/api/webhooks/") ||
      v.startsWith("https://discordapp.com/api/webhooks/")
        ? true
        : "Invalid Discord Webhook URL",
  });

  const port = await input({
    message: "Server port (HTTP mode):",
    default: "3000",
    validate: (v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 1 && n <= 65535
        ? true
        : "Enter a valid port number (1-65535)";
    },
  });

  const username = await input({
    message: "Bot display name (optional, press Enter to skip):",
  });

  const avatarUrl = await input({
    message: "Bot avatar URL (optional, press Enter to skip):",
  });

  const config: Record<string, unknown> = {
    webhookUrl,
    port: Number(port),
  };
  if (username) config.username = username;
  if (avatarUrl) config.avatarUrl = avatarUrl;

  const configDir = getConfigDir();
  const configPath = getConfigFilePath();
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

  console.log(`\nConfig saved to: ${configPath}`);

  const showHelp = await confirm({
    message: "Show registration commands?",
    default: true,
  });

  if (showHelp) {
    console.log(`
  --- stdio mode (recommended) ---
  claude mcp add discord-webhook -- npx discord-webhook-mcp
  codex mcp add discord-webhook -- npx discord-webhook-mcp

  --- HTTP mode ---
  # Start server first:
  npx discord-webhook-mcp serve

  # Then register:
  claude mcp add --transport http discord-webhook http://localhost:${port}/mcp
`);
  }
}
