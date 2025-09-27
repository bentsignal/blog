"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import { useConvexAuth } from "convex/react";
import * as Icons from "lucide-react";
import { Icon } from "lucide-react";
import { Separator as BaseSeparator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Style = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
};

interface ComposerInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: () => void;
  authed: boolean;
}

interface ComposerContextType extends ComposerInputProps {
  style: Style;
  setStyle: React.Dispatch<React.SetStateAction<Style>>;
  submitDisabled: boolean;
}

export const ComposerContext = createContext<ComposerContextType>(
  {} as ComposerContextType,
);

const useComposerContext = <T,>(
  selector: ContextSelector<ComposerContextType, T>,
) => useContextSelector(ComposerContext, selector);

export const Provider = ({
  onSubmit,
  inputValue,
  setInputValue,
  inputRef,
  children,
  authed,
}: ComposerInputProps & { children: React.ReactNode }) => {
  const [style, setStyle] = useState<Style>({
    bold: false,
    italic: false,
    strikethrough: false,
  });
  const submitDisabled = inputValue.trim() === "" || !authed;

  const contextValue = useMemo(
    () => ({
      inputRef,
      inputValue,
      setInputValue,
      onSubmit,
      style,
      setStyle,
      submitDisabled,
      authed,
    }),
    [inputValue, onSubmit, style, submitDisabled],
  );

  return (
    <ComposerContext.Provider value={contextValue}>
      {children}
    </ComposerContext.Provider>
  );
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex flex-col justify-center rounded-xl p-3">
      {children}
    </div>
  );
};

export const Input = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const inputRef = useComposerContext((c) => c.inputRef);
  const inputValue = useComposerContext((c) => c.inputValue);
  const setInputValue = useComposerContext((c) => c.setInputValue);
  const onSubmit = useComposerContext((c) => c.onSubmit);
  const submitDisabled = useComposerContext((c) => c.submitDisabled);
  const authed = useComposerContext((c) => c.authed);

  return (
    <input
      ref={inputRef}
      className={cn(
        "mt-1 mb-2 w-full flex-1 rounded-md p-2 duration-200 focus:outline-none",
        authed
          ? "placeholder-muted-foreground"
          : "placeholder-muted-foreground/20",
      )}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      disabled={!authed}
      onKeyDown={(e) => {
        if (submitDisabled) return;
        if (e.key === "Enter") {
          onSubmit();
        }
      }}
      placeholder="Type your message here..."
    />
  );
};

export const Submit = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onSubmit = useComposerContext((c) => c.onSubmit);
  const submitDisabled = useComposerContext((c) => c.inputValue.trim() === "");

  return (
    <Button
      onClick={onSubmit}
      size="icon"
      disabled={submitDisabled}
      className="bg-green-800 hover:bg-green-900"
    >
      <Icons.Send className="h-4 w-4 text-white" />
    </Button>
  );
};

const Separator = () => {
  return (
    <BaseSeparator
      orientation="vertical"
      className="bg-muted-foreground/20 mx-1 h-6!"
    />
  );
};

export const Header = () => {
  return (
    <div className="text-muted-foreground flex items-center">
      <BoldButton />
      <ItalicButton />
      <StrikethroughButton />
      <Separator />
      <LinkButton />
      <ListOrderedButton />
      <ListButton />
      <Separator />
      <QuoteButton />
      <CodeButton />
      <BlockCodeButton />
    </div>
  );
};

export const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center">{children}</div>;
};

export const CommonActions = () => {
  return (
    <div className="text-muted-foreground flex flex-1 items-center">
      <PlusMenu />
      <BaselineButton />
      <EmojiButton />
      <AtButton />
      <Separator />
      <VideoButton />
      <MicrophoneButton />
      <Separator />
      <CommandButton />
    </div>
  );
};

export const BoldButton = () => {
  const setStyle = useComposerContext((c) => c.setStyle);
  const active = useComposerContext((c) => c.style.bold);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStyle((prev) => ({ ...prev, bold: !prev.bold }));
      }}
    >
      <Icons.Bold
        className={active ? "text-primary" : ""}
        strokeWidth={active ? 4 : 2}
      />
    </Button>
  );
};

export const ItalicButton = () => {
  const setStyle = useComposerContext((c) => c.setStyle);
  const active = useComposerContext((c) => c.style.italic);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStyle((prev) => ({ ...prev, italic: !prev.italic }));
      }}
    >
      <Icons.Italic
        className={active ? "text-primary" : ""}
        strokeWidth={active ? 4 : 2}
      />
    </Button>
  );
};

export const StrikethroughButton = () => {
  const setStyle = useComposerContext((c) => c.setStyle);
  const active = useComposerContext((c) => c.style.strikethrough);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStyle((prev) => ({ ...prev, strikethrough: !prev.strikethrough }));
      }}
    >
      <Icons.Strikethrough
        className={active ? "text-primary" : ""}
        strokeWidth={active ? 4 : 2}
      />
    </Button>
  );
};

export const LinkButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Link />
    </Button>
  );
};

export const ListOrderedButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.ListOrdered />
    </Button>
  );
};

export const ListButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.List />
    </Button>
  );
};

export const QuoteButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.TextQuote />
    </Button>
  );
};

export const CodeButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Code />
    </Button>
  );
};

export const BlockCodeButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.MessageSquareCode />
    </Button>
  );
};

export const PlusMenu = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="mr-1 rounded-full border-none"
    >
      <Icons.Plus />
    </Button>
  );
};

export const BaselineButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Baseline />
    </Button>
  );
};

export const EmojiButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Smile />
    </Button>
  );
};

export const AtButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.AtSign />
    </Button>
  );
};

export const VideoButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Video />
    </Button>
  );
};

export const MicrophoneButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Mic />
    </Button>
  );
};

export const CommandButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.SlashSquare />
    </Button>
  );
};
