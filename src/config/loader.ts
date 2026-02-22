import { readFileSync, existsSync } from "node:fs";
import { configSchema, type Config } from "./schema.js";
import { getConfigFilePath } from "./paths.js";

export interface CliArgs {
  webhook?: string;
  port?: string;
  username?: string;
  avatarUrl?: string;
}

function loadConfigFile(): Record<string, unknown> {
  const path = getConfigFilePath();
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

export function loadConfig(cliArgs: CliArgs = {}): Config {
  const file = loadConfigFile();

  const raw = {
    webhookUrl:
      cliArgs.webhook ||
      process.env.DWM_WEBHOOK_URL ||
      file.webhookUrl,
    port: cliArgs.port
      ? Number(cliArgs.port)
      : process.env.DWM_PORT
        ? Number(process.env.DWM_PORT)
        : file.port ?? 3000,
    username:
      cliArgs.username ||
      process.env.DWM_USERNAME ||
      file.username ||
      undefined,
    avatarUrl:
      cliArgs.avatarUrl ||
      process.env.DWM_AVATAR_URL ||
      file.avatarUrl ||
      undefined,
  };

  return configSchema.parse(raw);
}
