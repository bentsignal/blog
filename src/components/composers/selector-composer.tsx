"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import {
  AtSign,
  Baseline,
  Bold,
  Code,
  Italic,
  Link,
  List,
  ListOrdered,
  MessageSquareCode,
  Mic,
  Plus,
  Send,
  SlashSquare,
  Smile,
  Strikethrough,
  TextQuote,
  Video,
} from "lucide-react";
import { Separator as BaseSeparator } from "../ui/separator";
import { Button } from "@/components/ui/button";

interface ComposerContextType {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
}

export const ComposerContext = createContext<ComposerContextType>(
  {} as ComposerContextType,
);

const useComposerContext = <T,>(
  selector: ContextSelector<ComposerContextType, T>,
) => useContextSelector(ComposerContext, selector);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  const onSend = useCallback(() => {
    console.log(inputRef.current?.value || "");
    setInputValue("");
  }, []);

  const contextValue = useMemo(
    () => ({ inputRef, inputValue, setInputValue, onSend }),
    [inputValue, onSend],
  );

  return (
    <ComposerContext.Provider value={contextValue}>
      {children}
    </ComposerContext.Provider>
  );
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-card flex flex-col justify-center rounded-xl p-3">
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
  const onSend = useComposerContext((c) => c.onSend);

  return (
    <input
      ref={inputRef}
      className="mt-1 mb-2 w-full flex-1 rounded-md p-2 focus:outline-none"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSend();
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

  const onSend = useComposerContext((c) => c.onSend);

  return (
    <Button onClick={onSend} size="icon">
      <Send className="text-background h-4 w-4" />
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
  return (
    <Button variant="ghost" size="icon">
      <Bold />
    </Button>
  );
};

export const ItalicButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Italic />
    </Button>
  );
};

export const StrikethroughButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Strikethrough />
    </Button>
  );
};

export const LinkButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Link />
    </Button>
  );
};

export const ListOrderedButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <ListOrdered />
    </Button>
  );
};

export const ListButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <List />
    </Button>
  );
};

export const QuoteButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <TextQuote />
    </Button>
  );
};

export const CodeButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Code />
    </Button>
  );
};

export const BlockCodeButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <MessageSquareCode />
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
      <Plus />
    </Button>
  );
};

export const BaselineButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Baseline />
    </Button>
  );
};

export const EmojiButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Smile />
    </Button>
  );
};

export const AtButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <AtSign />
    </Button>
  );
};

export const VideoButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Video />
    </Button>
  );
};

export const MicrophoneButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Mic />
    </Button>
  );
};

export const CommandButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <SlashSquare />
    </Button>
  );
};
