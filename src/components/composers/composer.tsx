"use client";

import { createContext, use, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { Separator as BaseSeparator } from "../ui/separator";
import { Button } from "@/components/ui/button";

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
}

interface ComposerContextType extends ComposerInputProps {
  style: Style;
  setStyle: React.Dispatch<React.SetStateAction<Style>>;
  submitDisabled: boolean;
}

export const ComposerContext = createContext<ComposerContextType>(
  {} as ComposerContextType,
);

export const Provider = ({
  onSubmit,
  inputValue,
  setInputValue,
  inputRef,
  children,
}: ComposerInputProps & { children: React.ReactNode }) => {
  const [style, setStyle] = useState<Style>({
    bold: false,
    italic: false,
    strikethrough: false,
  });

  const submitDisabled = inputValue.trim() === "";

  const contextValue = useMemo(
    () => ({
      inputRef,
      inputValue,
      setInputValue,
      onSubmit,
      style,
      setStyle,
      submitDisabled,
    }),
    [inputValue, onSubmit, style, submitDisabled],
  );

  return <ComposerContext value={contextValue}>{children}</ComposerContext>;
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex flex-col justify-center rounded-xl p-3">
      {children}
    </div>
  );
};

export const Input = () => {
  const { inputRef, inputValue, setInputValue, onSubmit, submitDisabled } =
    use(ComposerContext);

  return (
    <input
      ref={inputRef}
      className="mt-1 mb-2 w-full flex-1 rounded-md p-2 focus:outline-none"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
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
  const { onSubmit, submitDisabled } = use(ComposerContext);

  return (
    <Button onClick={onSubmit} size="icon" disabled={submitDisabled}>
      <Icons.Send className="text-background h-4 w-4" />
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
  const { setStyle, style } = use(ComposerContext);
  const active = style.bold;

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
  const { setStyle, style } = use(ComposerContext);
  const active = style.italic;

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
  const { setStyle, style } = use(ComposerContext);
  const active = style.strikethrough;

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
