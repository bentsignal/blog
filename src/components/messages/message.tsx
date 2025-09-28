"use client";

import { memo, useMemo, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { getProfileUrl, getTimestamp } from "@/lib/utils";

export interface Message {
  _id: Doc<"messages">["_id"];
  _creationTime: number;
  username: Doc<"users">["username"];
  pfp: Doc<"users">["pfp"];
  content: string;
}

export const MessageContext = createContext<Message>({} as Message);

export const useMessageContext = <T,>(selector: ContextSelector<Message, T>) =>
  useContextSelector(MessageContext, selector);

export const Provider = ({
  message,
  children,
}: {
  message: Message;
  children: React.ReactNode;
}) => {
  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      username: message.username,
      pfp: message.pfp,
      content: message.content,
    }),
    [message],
  );
  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-2">{children}</div>;
};

export const PFP = () => {
  const pfp = useMessageContext((c) => c.pfp);
  const username = useMessageContext((c) => c.username);

  const [imageState, setImageState] = useState<"loading" | "error" | "loaded">(
    "loading",
  );
  if (imageState === "error") {
    return (
      <div className="bg-muted flex size-10 flex-shrink-0 items-center justify-center rounded-md">
        <UserRound className="text-muted-foreground size-4" />
      </div>
    );
  }

  return (
    <Link href={getProfileUrl(username)} target="_blank">
      <img
        src={pfp}
        alt="pfp"
        className="size-10 flex-shrink-0 rounded-md"
        onError={() => setImageState("error")}
        onLoad={() => setImageState("loaded")}
      />
    </Link>
  );
};

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>;
};

export const Header = () => {
  const username = useMessageContext((c) => c.username);
  const _creationTime = useMessageContext((c) => c._creationTime);
  return (
    <div className="flex items-center gap-2">
      <Link href={getProfileUrl(username)} target="_blank">
        <div className="text-sm font-bold">{username}</div>
      </Link>
      <div className="text-muted-foreground text-xs">
        {getTimestamp(_creationTime)}
      </div>
    </div>
  );
};

export const Content = () => {
  const content = useMessageContext((c) => c.content);
  return (
    <div className="text-muted-foreground text-sm font-medium">{content}</div>
  );
};
