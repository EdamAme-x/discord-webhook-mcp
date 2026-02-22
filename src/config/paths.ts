import { homedir } from "node:os";
import { join } from "node:path";

const APP_NAME = "discord-webhook-mcp";

export function getConfigDir(): string {
  const xdgConfig = process.env.XDG_CONFIG_HOME;
  const base = xdgConfig || join(homedir(), ".config");
  return join(base, APP_NAME);
}

export function getConfigFilePath(): string {
  return join(getConfigDir(), "config.json");
}
