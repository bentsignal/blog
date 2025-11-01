import type { Slug } from "@/types/slugs";

export interface Channel {
  name: string;
}

export const channels = {
  general: {
    name: "General",
  },
} as const satisfies Partial<Record<Slug, Channel>>;

export type ChannelSlug = keyof typeof channels;

export const channelSlugs = Object.keys(channels) as ChannelSlug[];
