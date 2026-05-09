"use client";

import { companies, socials } from "./data";
import { Button } from "@/atoms/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/atoms/drawer";
import { cn } from "@/utils";

const SocialsSheet = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Socials</DrawerTitle>
          <div className="flex flex-col gap-1 px-4 pt-2 pb-4">
            {companies.map((company) => {
              const social = socials[company];
              const Icon = social.icon;
              return (
                <a
                  key={company}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-accent flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
                >
                  <Icon
                    className={cn(
                      "size-5",
                      (social as { className?: string }).className,
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium capitalize">
                      {company === "x" ? "X" : company}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {social.label}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export { SocialsSheet };
