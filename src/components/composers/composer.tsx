"use client";

import { useMemo, useState } from "react";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import * as Icons from "lucide-react";
import { Separator as BaseSeparator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from "@/lib/config";
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
  onCancel?: () => void;
}

interface ComposerContextType extends ComposerInputProps {
  style: Style;
  setStyle: React.Dispatch<React.SetStateAction<Style>>;
  submitDisabled: boolean;
}

export const ComposerContext = createContext<ComposerContextType>(
  {} as ComposerContextType,
);

const useComposer = <T,>(selector: ContextSelector<ComposerContextType, T>) =>
  useContextSelector(ComposerContext, selector);

export const Provider = ({
  onSubmit,
  inputValue,
  setInputValue,
  inputRef,
  onCancel,
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
      onCancel,
      style,
      setStyle,
      submitDisabled,
    }),
    [inputValue, onSubmit, onCancel, style, submitDisabled],
  );

  return (
    <ComposerContext.Provider value={contextValue}>
      {children}
    </ComposerContext.Provider>
  );
};

export const Frame = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-muted flex flex-col justify-center rounded-2xl p-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Input = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const inputRef = useComposer((c) => c.inputRef);
  const inputValue = useComposer((c) => c.inputValue);
  const setInputValue = useComposer((c) => c.setInputValue);
  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.submitDisabled);
  const onCancel = useComposer((c) => c.onCancel);

  return (
    <input
      ref={inputRef}
      className="mt-1 mb-2 w-full flex-1 rounded-md p-2 duration-200 focus:outline-none"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (submitDisabled) return;
        if (e.key === "Enter") {
          onSubmit();
        }
        if (e.key === "Escape") {
          onCancel?.();
        }
      }}
      placeholder="Type your message here..."
      minLength={MIN_MESSAGE_LENGTH}
      maxLength={MAX_MESSAGE_LENGTH}
    />
  );
};

export const Send = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.inputValue.trim() === "");

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

export const Cancel = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onCancel = useComposer((c) => c.onCancel);

  return (
    <Button variant="destructive" size="icon" onClick={onCancel}>
      <Icons.X className="text-white" />
    </Button>
  );
};

export const Save = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const onSubmit = useComposer((c) => c.onSubmit);
  const submitDisabled = useComposer((c) => c.submitDisabled);

  return (
    <Button
      className="bg-green-800 hover:bg-green-900"
      size="icon"
      onClick={onSubmit}
      disabled={submitDisabled}
    >
      <Icons.Save className="text-white" />
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
    <div className="flex items-center">
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
    <div className="flex flex-1 items-center">
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
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const setStyle = useComposer((c) => c.setStyle);
  const active = useComposer((c) => c.style.bold);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStyle((prev) => ({ ...prev, bold: !prev.bold }));
      }}
    >
      <Icons.Bold
        className={active ? "text-primary" : "text-muted-foreground"}
        strokeWidth={active ? 4 : 2}
      />
    </Button>
  );
};

export const ItalicButton = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const setStyle = useComposer((c) => c.setStyle);
  const active = useComposer((c) => c.style.italic);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStyle((prev) => ({ ...prev, italic: !prev.italic }));
      }}
    >
      <Icons.Italic
        className={active ? "text-primary" : "text-muted-foreground"}
        strokeWidth={active ? 4 : 2}
      />
    </Button>
  );
};

export const StrikethroughButton = () => {
  const hasParentContext = useHasParentContext(ComposerContext);
  if (!hasParentContext) {
    throw new Error("ComposerContext not found");
  }

  const setStyle = useComposer((c) => c.setStyle);
  const active = useComposer((c) => c.style.strikethrough);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setStyle((prev) => ({ ...prev, strikethrough: !prev.strikethrough }));
      }}
    >
      <Icons.Strikethrough
        className={active ? "text-primary" : "text-muted-foreground"}
        strokeWidth={active ? 4 : 2}
      />
    </Button>
  );
};

export const LinkButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Link className="text-muted-foreground" />
    </Button>
  );
};

export const ListOrderedButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.ListOrdered className="text-muted-foreground" />
    </Button>
  );
};

export const ListButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.List className="text-muted-foreground" />
    </Button>
  );
};

export const QuoteButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.TextQuote className="text-muted-foreground" />
    </Button>
  );
};

export const CodeButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Code className="text-muted-foreground" />
    </Button>
  );
};

export const BlockCodeButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.MessageSquareCode className="text-muted-foreground" />
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
      <Icons.Plus className="text-muted-foreground" />
    </Button>
  );
};

export const BaselineButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Baseline className="text-muted-foreground" />
    </Button>
  );
};

export const EmojiButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Smile className="text-muted-foreground" />
    </Button>
  );
};

export const AtButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.AtSign className="text-muted-foreground" />
    </Button>
  );
};

export const VideoButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Video className="text-muted-foreground" />
    </Button>
  );
};

export const MicrophoneButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.Mic className="text-muted-foreground" />
    </Button>
  );
};

export const CommandButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icons.SlashSquare className="text-muted-foreground" />
    </Button>
  );
};
