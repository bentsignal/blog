"use client";

import { ReactNode, useEffect, useState } from "react";
import { languages } from "@/data/languages";
import { cn } from "@/utils/style-utils";
import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { codeToHtml } from "shiki";
import { toast } from "sonner";
import { Button } from "@/atoms/button";
import { createContext, useRequiredContext } from "@/lib/context";

export const { Context: CodeContext, useContext: useCode } = createContext<{
  code: string;
  language: string;
}>({ displayName: "CodeContext" });

export function Provider({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  if (!children) return null;

  const code = children.toString();
  const language = className?.split("-")[1];

  const isInline = language === undefined;
  if (isInline) {
    return (
      <code
        className={cn(
          "not-prose bg-muted rounded-md px-1.5 py-0.5 font-mono text-sm",
          className,
        )}
      >
        {code}
      </code>
    );
  }

  const contextValue = { code, language };

  return (
    <CodeContext.Provider value={contextValue}>
      <Block />
    </CodeContext.Provider>
  );
}

export const Block = () => {
  return (
    <div className="not-prose border-border group relative my-8 w-full overflow-hidden rounded-xl border-1">
      <TopBar />
      <Container>
        <Content />
      </Container>
    </div>
  );
};

const TopBar = () => {
  useRequiredContext(CodeContext);

  const language = useCode((c) => c.language);

  if (language === "no_top_bar") {
    return null;
  }

  return (
    <div className="bg-border flex h-14 w-full items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Language />
      </div>
      <div className="flex items-center gap-2">
        <CopyButton />
      </div>
    </div>
  );
};

export function Container({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border bg-card supports-[backdrop-filter]:bg-card/50 text-card-foreground rounded-xl backdrop-blur-sm",
        "rounded-t-none border-none bg-transparent p-6",
      )}
    >
      {children}
    </div>
  );
}

export function Content() {
  useRequiredContext(CodeContext);

  const code = useCode((c) => c.code);
  const language = useCode((c) => c.language);

  const { theme } = useTheme();

  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    async function highlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>");
        return;
      }

      const html = await codeToHtml(code, {
        lang: language,
        theme: theme === "dark" ? "github-dark" : "github-light",
        transformers: [
          {
            pre(node) {
              node.properties.style = undefined;
            },
            code(node) {
              node.properties.style = undefined;
            },
          },
        ],
      });
      setHighlightedHtml(html);
    }
    highlight();
  }, [code, language, theme]);

  const classNames = cn(
    "w-full overflow-auto text-[13px]",
    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
  );

  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  ) : (
    <div className={classNames}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export const Language = () => {
  useRequiredContext(CodeContext);

  const language = useCode((c) => c.language);

  if (language in languages) {
    const { label } = languages[language as keyof typeof languages];
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-semibold">
          {label}
        </span>
      </div>
    );
  }

  return null;
};

export function CopyButton() {
  useRequiredContext(CodeContext);

  const code = useCode((c) => c.code);

  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!navigator?.clipboard && mounted) return null;

  const handleCopy = async () => {
    try {
      const textToCopy = code.trim();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      toast.error("Failed to copy text, see console for more details");
      console.error("Failed to copy text: ", err);
    } finally {
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size="sm"
      variant="ghost"
      className="h-8 w-8 p-0"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
