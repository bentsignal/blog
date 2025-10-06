"use client";

import { useRef, useState } from "react";
import { useAuth } from "../auth";
import * as Composer from "./composer";
import { useMessageActions } from "@/hooks/use-message-actions";

export const MainComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);

  const { sendMessage } = useMessageActions();

  const onSubmit = async () => {
    if (!signedIn) {
      await signIn();
      return;
    }
    const value = inputRef.current?.value ?? "";
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
          <Composer.Send />
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Provider>
  );
};
