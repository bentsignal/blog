"use client";

import { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useMutation } from "convex/react";
import * as Selector from "./composer";

export const MainComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sendMessage = useMutation(api.messages.sendMessage);

  const onSubmit = () => {
    const value = inputRef.current?.value || "";
    setInputValue("");
    sendMessage({
      content: value,
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
