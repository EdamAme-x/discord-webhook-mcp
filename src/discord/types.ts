export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
}

export interface EmbedThumbnail {
  url: string;
}

export interface EmbedImage {
  url: string;
}

export interface Embed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: EmbedField[];
  footer?: EmbedFooter;
  timestamp?: string;
  thumbnail?: EmbedThumbnail;
  image?: EmbedImage;
}

export interface WebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: Embed[];
}
