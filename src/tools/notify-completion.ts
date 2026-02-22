import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DiscordClient } from "../discord/client.js";
import { buildCompletionEmbed } from "../discord/embed-builder.js";

export function registerNotifyCompletion(
  server: McpServer,
  discord: DiscordClient
) {
  server.tool(
    "notify_completion",
    "Send a task completion notification to Discord (green embed)",
    {
      task_name: z.string().describe("Name of the completed task"),
      summary: z.string().optional().describe("Brief summary of what was done"),
      details: z.string().optional().describe("Detailed information"),
      language: z
        .enum(["en", "ja"])
        .default("en")
        .describe("Notification language (en or ja)"),
    },
    async ({ task_name, summary, details, language }) => {
      const embed = buildCompletionEmbed(task_name, language, summary, details);
      await discord.send({ embeds: [embed] });
      return {
        content: [
          {
            type: "text" as const,
            text: `Completion notification sent for: ${task_name}`,
          },
        ],
      };
    }
  );
}
