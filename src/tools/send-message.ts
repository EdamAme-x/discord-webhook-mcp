import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DiscordClient } from "../discord/client.js";

export function registerSendMessage(server: McpServer, discord: DiscordClient) {
  server.tool(
    "send_message",
    "Send a plain text message to Discord via webhook",
    {
      content: z
        .string()
        .max(2000)
        .describe("Message content (max 2000 characters)"),
    },
    async ({ content }) => {
      await discord.send({ content });
      return {
        content: [{ type: "text" as const, text: "Message sent to Discord." }],
      };
    }
  );
}
