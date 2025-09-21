"use client";

import { useRef, useState } from "react";
import { File } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import * as Composer from "./composer";
import * as Selector from "./selector-composer";

export const ViewFileButton = ({ url }: { url: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={url} target="_blank" className="absolute top-0 right-0 m-4">
          <Button variant="ghost">
            <File />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>View file</TooltipContent>
    </Tooltip>
  );
};

export const SelectorComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    const value = inputRef.current?.value || "";
    setInputValue("");
    toast.success("Sent with context selector", {
      description: value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Selector.Provider
        onSubmit={onSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        inputRef={inputRef}
      >
        <Selector.Frame>
          <Selector.Header />
          <Selector.Input />
          <Selector.Footer>
            <Selector.CommonActions />
            <Selector.Submit />
          </Selector.Footer>
        </Selector.Frame>
      </Selector.Provider>
      <div className="flex flex-col gap-2">
        <span className="text-foreground text-sm">Outside Composer</span>
        <div className="flex gap-2">
          <Button onClick={() => inputRef.current?.focus()}>Focus Input</Button>
          <Button onClick={() => inputRef.current?.blur()}>Blur Input</Button>
        </div>
      </div>
      <ViewFileButton url="https://github.com/bentsignal/slack-composer/blob/main/src/components/composers/selector-composer.tsx" />
    </div>
  );
};

export const StandardComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    const value = inputRef.current?.value || "";
    setInputValue("");
    toast.success("Sent without context selector", {
      description: value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Composer.Provider
        onSubmit={onSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        inputRef={inputRef}
      >
        <Composer.Frame>
          <Composer.Header />
          <Composer.Input />
          <Composer.Footer>
            <Composer.CommonActions />
            <Composer.Submit />
          </Composer.Footer>
        </Composer.Frame>
      </Composer.Provider>
      <div className="flex flex-col gap-2">
        <span className="text-foreground text-sm">Outside Composer</span>
        <div className="flex gap-2">
          <Button onClick={() => inputRef.current?.focus()}>Focus Input</Button>
          <Button onClick={() => inputRef.current?.blur()}>Blur Input</Button>
        </div>
      </div>
      <ViewFileButton url="https://github.com/bentsignal/slack-composer/blob/main/src/components/composers/composer.tsx" />
    </div>
  );
};
