import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DiscordClient } from "../discord/client.js";
import { registerSendMessage } from "./send-message.js";
import { registerSendEmbed } from "./send-embed.js";
import { registerNotifyCompletion } from "./notify-completion.js";
import { registerAskConfirmation } from "./ask-confirmation.js";

export function registerAllTools(server: McpServer, discord: DiscordClient) {
  registerSendMessage(server, discord);
  registerSendEmbed(server, discord);
  registerNotifyCompletion(server, discord);
  registerAskConfirmation(server, discord);
}
