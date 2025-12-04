"use client";

import { ScrollContext, useScroll } from "@/atoms/scroll";
import { useRequiredContext } from "@/lib/context";

const HashLink = ({
  href,
  children,
  ...props
}: { href: string; children: React.ReactNode } & React.ComponentProps<"a">) => {
  useRequiredContext(ScrollContext);
  const containerRef = useScroll((c) => c.containerRef);

  return (
    // eslint-disable-next-line
    <a
      {...props}
      href={href}
      onClick={(e) => {
        const container = containerRef.current;
        if (!container) return;
        const target = document.querySelector(href) as HTMLElement | null;
        if (!target) return;

        e.preventDefault();

        const distanceFromTopToTarget = target.getBoundingClientRect().top;

        const targetIsNearTop = distanceFromTopToTarget < 300;
        if (targetIsNearTop) {
          container.scrollTo({
            top: 0,
          });
          return;
        }

        const targetIsNearBottom =
          distanceFromTopToTarget >
          container.scrollHeight - container.clientHeight - 300;
        if (targetIsNearBottom) {
          container.scrollTo({
            top: container.scrollHeight - container.clientHeight,
          });
          return;
        }

        // add a bit of extra top padding when scrolling to an item
        // in the middle of the page to make it easier to read.
        container.scrollTo({
          top: distanceFromTopToTarget - 100,
        });
      }}
    >
      {children}
    </a>
  );
};

export default HashLink;
