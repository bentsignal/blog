import Link from "next/link";
import { companies, socials } from "./data";
import { cn } from "@/utils/style-utils";

const SocialsBar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {companies.map((company) => {
        const social = socials[company];
        const Icon = social.icon;
        return (
          <Link
            key={company}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              className={cn(
                "size-5",
                (social as { className?: string }).className,
              )}
            />
          </Link>
        );
      })}
    </div>
  );
};

export { SocialsBar };
