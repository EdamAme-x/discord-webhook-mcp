import type { Config } from "../config/schema.js";
import type { WebhookPayload } from "./types.js";

export class DiscordClient {
  private webhookUrl: string;
  private defaultUsername?: string;
  private defaultAvatarUrl?: string;

  constructor(config: Config) {
    this.webhookUrl = config.webhookUrl;
    this.defaultUsername = config.username;
    this.defaultAvatarUrl = config.avatarUrl;
  }

  async send(payload: WebhookPayload): Promise<void> {
    const body: WebhookPayload = {
      ...payload,
      username: payload.username ?? this.defaultUsername,
      avatar_url: payload.avatar_url ?? this.defaultAvatarUrl,
    };

    const res = await fetch(this.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Discord webhook failed (${res.status}): ${text}`
      );
    }
  }
}
