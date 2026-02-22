import type { Embed } from "./types.js";

export type Lang = "en" | "ja";

const COLOR_GREEN = 0x57f287;
const COLOR_YELLOW = 0xfee75c;

const i18n = {
  en: {
    taskCompleted: (name: string) => `Task Completed: ${name}`,
    summary: "Summary",
    details: "Details",
    confirmationRequired: "Confirmation Required",
    context: "Context",
    options: "Options",
  },
  ja: {
    taskCompleted: (name: string) => `作業完了: ${name}`,
    summary: "概要",
    details: "詳細",
    confirmationRequired: "確認が必要です",
    context: "背景",
    options: "選択肢",
  },
} as const;

export function buildCompletionEmbed(
  taskName: string,
  lang: Lang = "en",
  summary?: string,
  details?: string
): Embed {
  const t = i18n[lang];
  const fields: Embed["fields"] = [];
  if (summary) {
    fields.push({ name: t.summary, value: summary });
  }
  if (details) {
    fields.push({ name: t.details, value: details });
  }

  return {
    title: t.taskCompleted(taskName),
    color: COLOR_GREEN,
    fields: fields.length > 0 ? fields : undefined,
    timestamp: new Date().toISOString(),
    footer: { text: "discord-webhook-mcp" },
  };
}

export function buildConfirmationEmbed(
  question: string,
  lang: Lang = "en",
  context?: string,
  options?: string[]
): Embed {
  const t = i18n[lang];
  const fields: Embed["fields"] = [];
  if (context) {
    fields.push({ name: t.context, value: context });
  }
  if (options && options.length > 0) {
    fields.push({
      name: t.options,
      value: options.map((o, i) => `${i + 1}. ${o}`).join("\n"),
    });
  }

  return {
    title: t.confirmationRequired,
    description: question,
    color: COLOR_YELLOW,
    fields: fields.length > 0 ? fields : undefined,
    timestamp: new Date().toISOString(),
    footer: { text: "discord-webhook-mcp" },
  };
}
