"use client";

import { useMemo, useRef, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { Pencil, Trash, UserRound } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../auth";
import { EditComposer } from "../composers";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { getFullTimestamp, getTimeString, isOverOneDayAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useMessageActions } from "@/hooks/use-message-actions";

export interface Message extends Doc<"messages"> {
  name: string;
  pfp: string | null | undefined;
}

interface MessageContextType extends Message {
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
  editInProgress: boolean;
  setEditInProgress: (editInProgress: boolean) => void;
  editComposerInputRef: React.RefObject<HTMLInputElement | null>;
}

export const MessageContext = createContext<MessageContextType>(
  {} as MessageContextType,
);

export const useMessage = <T,>(
  selector: ContextSelector<MessageContextType, T>,
) => useContextSelector(MessageContext, selector);

export const Provider = ({
  message,
  children,
}: {
  message: Message;
  children: React.ReactNode;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [editInProgress, setEditInProgress] = useState(false);
  const editComposerInputRef = useRef<HTMLInputElement>(null);

  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      profile: message.profile,
      name: message.name,
      pfp: message.pfp,
      snapshots: message.snapshots,
      isHovering,
      setIsHovering,
      editInProgress,
      setEditInProgress,
      editComposerInputRef,
    }),
    [message, isHovering, setIsHovering, editInProgress, setEditInProgress],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {editInProgress ? <EditComposer /> : children}
    </MessageContext.Provider>
  );
};

export const Frame = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const setIsHovering = useMessage((c) => c.setIsHovering);
  return (
    <div
      className={cn(
        "hover:bg-muted relative flex gap-3 px-6 py-0.5",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
    </div>
  );
};

export const PFP = () => {
  const pfp = useMessage((c) => c.pfp);

  const [imageState, setImageState] = useState<"loading" | "error" | "loaded">(
    "loading",
  );

  if (imageState === "error" || !pfp) {
    return (
      <SkeletonPFP>
        <UserRound className="text-muted-foreground size-4" />
      </SkeletonPFP>
    );
  }

  return (
    <Image
      src={pfp}
      alt=""
      width={40}
      height={40}
      className="size-10 flex-shrink-0 rounded-full"
      onError={() => setImageState("error")}
      onLoad={() => setImageState("loaded")}
    />
  );
};

export const Body = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};

export const Time = ({ time }: { time: string }) => {
  return <div className="text-muted-foreground text-xxs">{time}</div>;
};

export const Header = () => {
  const name = useMessage((c) => c.name);

  const _creationTime = useMessage((c) => c._creationTime);
  const timeStamp = isOverOneDayAgo(_creationTime)
    ? getFullTimestamp(_creationTime)
    : getTimeString(_creationTime);

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold">{name || "Unknown"}</div>
      <Time time={timeStamp} />
    </div>
  );
};

export const Content = () => {
  const snapshots = useMessage((c) => c.snapshots);
  return (
    <span className="text-muted-foreground text-sm font-medium">
      {snapshots[snapshots.length - 1].content}
      {snapshots?.length && snapshots.length > 1 && (
        <span className="text-muted-foreground/50 text-xxs ml-1 font-light">
          (edited)
        </span>
      )}
    </span>
  );
};

export const SkeletonPFP = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-muted flex size-10 flex-shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const SkeletonBar = ({ width }: { width: number }) => {
  return (
    <div
      className="bg-muted-foreground/10 h-3 rounded-md"
      style={{ width: `${width}%` }}
    />
  );
};

export const Skeleton = () => {
  const nameWidth = Math.random() * 40 + 20;
  const contentWidth = Math.random() * 70 + 10;
  return (
    <Frame className="mb-3 animate-pulse">
      <SkeletonPFP />
      <div className="mt-1 flex w-full flex-col gap-1.5">
        <SkeletonBar width={nameWidth} />
        <SkeletonBar width={contentWidth} />
      </div>
    </Frame>
  );
};

export const Error = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1">
      <div className="text-destructive text-sm font-bold">
        Failed to load messages
      </div>
      <div className="text-muted-foreground text-xs">
        Sorry about that, something went wrong.
      </div>
    </div>
  );
};

export const SideTime = () => {
  const isHovering = useMessage((c) => c.isHovering);
  const time = useMessage((c) => c._creationTime);
  return (
    <div className="w-13 flex-shrink-0">
      {isHovering && <Time time={getTimeString(time)} />}
    </div>
  );
};

export const Actions = () => {
  const isHovering = useMessage((c) => c.isHovering);
  const isSignedIn = useAuth((c) => c.signedIn);
  const myProfileId = useAuth((c) => c.myProfileId);
  const messageProfileId = useMessage((c) => c.profile);

  if (!isHovering) return null;
  if (!isSignedIn) return null;

  const isMyMessage = myProfileId === messageProfileId;

  if (isMyMessage) {
    return <MyMessageActions />;
  }

  return null;
};

const ActionFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute -top-5 right-2 flex">
      <ButtonGroup>{children}</ButtonGroup>
    </div>
  );
};

const MyMessageActions = () => {
  return (
    <ActionFrame>
      <EditButton />
      <DeleteButton />
    </ActionFrame>
  );
};

const EditButton = () => {
  const setEditInProgress = useMessage((c) => c.setEditInProgress);
  const editComposerInputRef = useMessage((c) => c.editComposerInputRef);
  return (
    <Button
      variant="outline"
      size="actions"
      onClick={() => {
        setEditInProgress(true);
        setTimeout(() => {
          editComposerInputRef.current?.focus();
        }, 100);
      }}
    >
      <Pencil className="size-3" />
    </Button>
  );
};

const DeleteButton = () => {
  const id = useMessage((c) => c._id);
  const { deleteMessage } = useMessageActions();
  return (
    <Button
      variant="outline"
      size="actions"
      onClick={() => deleteMessage({ messageId: id })}
    >
      {" "}
      <Trash className="text-destructive size-3" />{" "}
    </Button>
  );
};
