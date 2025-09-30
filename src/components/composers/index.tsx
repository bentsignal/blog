"use client";

import { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useAuth } from "../auth";
import * as Composer from "./composer";

export const MainComposer = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const image = useAuth((c) => c.image);
  const name = useAuth((c) => c.name);
  const sendMessage = useMutation(
    api.messages.sendMessage,
  ).withOptimisticUpdate((localStore, args) => {
    const results = localStore.getAllQueries(api.messages.getMessages);
    const current = results[0];
    if (!current || !current.value) return;
    localStore.setQuery(
      api.messages.getMessages,
      {
        paginationOpts: current.args.paginationOpts,
      },
      {
        ...current.value,
        page: [
          {
            name: name || "",
            pfp: image,
            _id: ("optimistic-" +
              Math.random().toString(36).slice(2)) as Id<"messages">,
            _creationTime: Date.now(),
            content: args.content,
          },
          ...(current.value.page || []),
        ],
        isDone: current.value.isDone ?? false,
        continueCursor: current.value.continueCursor ?? "",
      },
    );
  });
  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);

  const onSubmit = async () => {
    if (!signedIn) {
      await signIn();
      return;
    }
    const value = inputRef.current?.value || "";
    setInputValue("");
    await sendMessage({
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
      <Composer.Frame>
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
