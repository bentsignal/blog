import { Mail as MailIcon } from "lucide-react";
import * as Icons from "./socials-icons";
import type { Company, Metadata } from "./socials-types";

const socials = {
  github: {
    url: "https://github.com/bentsignal",
    icon: Icons.Github,
  },
  x: {
    url: "https://x.com/bentsignal",
    icon: Icons.X,
    className: "size-4.5",
  },
  instagram: {
    url: "https://www.instagram.com/bentsignal/",
    icon: Icons.Instagram,
  },
  bluesky: {
    url: "https://bsky.app/profile/bentsignal.com",
    icon: Icons.Bluesky,
  },
  discord: {
    url: "https://discord.gg/Ep9YsvhZ",
    icon: Icons.Discord,
    className: "size-6",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/bentsignal/",
    icon: Icons.LinkedIn,
  },
  email: {
    url: "mailto:me@bentsignal.com",
    icon: MailIcon,
    className: "size-6",
  },
} as const satisfies Record<Company, Metadata>;

const companies = Object.keys(socials) as Company[];

export { socials, companies };
