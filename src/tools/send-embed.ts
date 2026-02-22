import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DiscordClient } from "../discord/client.js";

const fieldSchema = z.object({
  name: z.string().describe("Field name"),
  value: z.string().describe("Field value"),
  inline: z.boolean().optional().describe("Display inline"),
});

export function registerSendEmbed(server: McpServer, discord: DiscordClient) {
  server.tool(
    "send_embed",
    "Send a rich embed message to Discord via webhook",
    {
      title: z.string().optional().describe("Embed title"),
      description: z.string().optional().describe("Embed description"),
      color: z
        .number()
        .int()
        .optional()
        .describe("Embed color as integer (e.g. 0x57F287 = 5763335)"),
      fields: z.array(fieldSchema).optional().describe("Embed fields"),
      footer: z.string().optional().describe("Footer text"),
      timestamp: z
        .boolean()
        .optional()
        .describe("Include current timestamp"),
      url: z.string().url().optional().describe("Embed URL"),
      thumbnail_url: z
        .string()
        .url()
        .optional()
        .describe("Thumbnail image URL"),
      image_url: z.string().url().optional().describe("Large image URL"),
    },
    async (args) => {
      await discord.send({
        embeds: [
          {
            title: args.title,
            description: args.description,
            color: args.color,
            fields: args.fields,
            footer: args.footer ? { text: args.footer } : undefined,
            timestamp: args.timestamp
              ? new Date().toISOString()
              : undefined,
            url: args.url,
            thumbnail: args.thumbnail_url
              ? { url: args.thumbnail_url }
              : undefined,
            image: args.image_url ? { url: args.image_url } : undefined,
          },
        ],
      });
      return {
        content: [{ type: "text" as const, text: "Embed sent to Discord." }],
      };
    }
  );
}
