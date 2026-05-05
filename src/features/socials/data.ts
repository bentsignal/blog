import { Mail as MailIcon } from "lucide-react";
import * as Icons from "./icons";
import type { Company, Metadata } from "./types";

const socials = {
  github: {
    url: "https://github.com/bentsignal",
    icon: Icons.Github,
    label: "@bentsignal",
  },
  x: {
    url: "https://x.com/bentsignal",
    icon: Icons.X,
    label: "@bentsignal",
    className: "size-4.5",
  },
  instagram: {
    url: "https://www.instagram.com/bentsignal/",
    icon: Icons.Instagram,
    label: "@bentsignal",
  },
  bluesky: {
    url: "https://bsky.app/profile/bentsignal.com",
    icon: Icons.Bluesky,
    label: "@bentsignal.com",
  },
  discord: {
    url: "https://discord.gg/Ep9YsvhZ",
    icon: Icons.Discord,
    label: "bentsignal",
    className: "size-6",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/bentsignal/",
    icon: Icons.LinkedIn,
    label: "bentsignal",
  },
  email: {
    url: "mailto:me@bentsignal.com",
    icon: MailIcon,
    label: "me@bentsignal.com",
    className: "size-6",
  },
} as const satisfies Record<Company, Metadata>;

const companies = Object.keys(socials) as Company[];

export { socials, companies };
