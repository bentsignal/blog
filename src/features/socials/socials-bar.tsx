import { cn } from "@/utils/style-utils";
import Link from "next/link";
import { companies, socials } from "./socials-data";

const SocialsBar = () => {
  return (
    <div className="flex items-center gap-3">
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

export default SocialsBar;
