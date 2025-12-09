import { cn } from "@/utils/style-utils";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "not-prose border-border bg-card/50 group relative my-8 w-full",
        "overflow-hidden rounded-xl border-1",
      )}
    >
      {children}
    </div>
  );
};

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "dark:bg-border bg-input flex h-14 w-full items-center justify-between px-4",
      )}
    >
      {children}
    </div>
  );
};

const Body = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "my-1 flex w-full flex-col gap-1 overflow-x-auto px-6 py-5",
        className,
      )}
    >
      {children}
    </div>
  );
};

export { Container, Header, Body };
