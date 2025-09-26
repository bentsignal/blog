"use client";

import { useRef, useState } from "react";
import { File } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import * as Selector from "./composer";
import { useMessages } from "@/hooks/use-messages";

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

export const MainComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sendMessage = useMessages((state) => state.sendMessage);

  const onSubmit = () => {
    const value = inputRef.current?.value || "";
    setInputValue("");
    sendMessage({
      id: Date.now(),
      user: "user",
      content: value,
      createdAt: new Date(),
    });
  };

  return (
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
  );
};
