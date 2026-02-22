import { z } from "zod";

export const configSchema = z.object({
  webhookUrl: z.string().url(),
  port: z.number().int().min(1).max(65535).default(3000),
  username: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export type Config = z.infer<typeof configSchema>;
