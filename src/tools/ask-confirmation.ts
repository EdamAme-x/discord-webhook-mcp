import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DiscordClient } from "../discord/client.js";
import { buildConfirmationEmbed } from "../discord/embed-builder.js";

export function registerAskConfirmation(
  server: McpServer,
  discord: DiscordClient
) {
  server.tool(
    "ask_confirmation",
    "Send a confirmation request to Discord (yellow embed)",
    {
      question: z.string().describe("The question to ask"),
      context: z
        .string()
        .optional()
        .describe("Additional context for the question"),
      options: z
        .array(z.string())
        .optional()
        .describe("List of options to choose from"),
      language: z
        .enum(["en", "ja"])
        .default("en")
        .describe("Notification language (en or ja)"),
    },
    async ({ question, context, options, language }) => {
      const embed = buildConfirmationEmbed(question, language, context, options);
      await discord.send({ embeds: [embed] });
      return {
        content: [
          {
            type: "text" as const,
            text: `Confirmation request sent: ${question}`,
          },
        ],
      };
    }
  );
}
