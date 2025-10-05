"use client";

import { useRef, useState } from "react";
import { useAuth } from "../auth";
import * as Composer from "./composer";
import { useSendMessage } from "@/hooks/use-send-message";

export const MainComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);

  const { sendMessage } = useSendMessage();

  const onSubmit = async () => {
    if (!signedIn) {
      await signIn();
      return;
    }
    const value = inputRef.current?.value || "";
    setInputValue("");
    sendMessage({
      content: value,
    });
  };

  return (
    <Composer.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
    >
      <Composer.Frame className="mx-4 mb-4">
        <Composer.Header />
        <Composer.Input />
        <Composer.Footer>
          <Composer.CommonActions />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Provider>
  );
};
