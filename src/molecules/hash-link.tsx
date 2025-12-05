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
  const getScrollMeasurements = useScroll((c) => c.getScrollMeasurements);

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

        const { distanceFromTop, heightOfContainer, heightOfScrollWindow } =
          getScrollMeasurements();

        const distanceFromTargetToTopOfScrollWindow =
          target.getBoundingClientRect().top;
        const distanceFromTargetToTopOfContainer =
          distanceFromTop + distanceFromTargetToTopOfScrollWindow;

        const targetIsNearTopOfContainer =
          distanceFromTargetToTopOfContainer < 300;
        if (targetIsNearTopOfContainer) {
          container.scrollTo({
            top: 0,
          });
          return;
        }

        const maxValueOfTop = heightOfContainer - heightOfScrollWindow;
        const targetIsNearBottom =
          distanceFromTargetToTopOfContainer > heightOfContainer;
        if (targetIsNearBottom) {
          container.scrollTo({
            top: Math.min(maxValueOfTop, distanceFromTargetToTopOfContainer),
          });
          return;
        }

        container.scrollTo({
          top: distanceFromTargetToTopOfContainer - 100,
        });
      }}
    >
      {children}
    </a>
  );
};

export default HashLink;
