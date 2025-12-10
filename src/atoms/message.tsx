"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChatWindow } from "@/context/chat-window-context";
import { useAuth } from "@/features/auth";
import {
  EnhancedMessage,
  MessageInteractionState,
  REACTION_EMOJIS,
  ReactionEmoji,
} from "@/types/message-types";
import { getReactionCounts } from "@/utils/message-utils";
import { getRandomWidth } from "@/utils/skeleton-utils";
import { cn } from "@/utils/style-utils";
import {
  getFullTimestamp,
  getTimeString,
  isOverOneDayAgo,
} from "@/utils/time-utils";
import { Pencil, Reply, Trash, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import * as ButtonGroup from "./button-group";
import * as Shapes from "./shapes";
import * as ToolTip from "./tooltip";
import { createContext } from "@/lib/context";
import { useMessageActions } from "@/hooks/use-message-actions";

interface MessageContextType extends EnhancedMessage {
  interactionState: MessageInteractionState;
  setInteractionState: (interactionState: MessageInteractionState) => void;
  editComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  replyComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

export const { Context: MessageContext, useContext: useMessage } =
  createContext<MessageContextType>({ displayName: "MessageContext" });

export const Provider = ({
  message,
  children,
}: {
  message: EnhancedMessage;
  children: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [interactionState, setInteractionState] =
    useState<MessageInteractionState>("idle");

  const editComposerInputRef = useRef<HTMLTextAreaElement>(null);
  const replyComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const myProfileId = useAuth((c) => c.myProfileId);
  const imNotSignedIn = useAuth((c) => !c.imSignedIn);

  const frameRef = useRef<HTMLDivElement>(null);

  // determine if user has seen message
  const observerRef = useRef<IntersectionObserver | null>(null);
  const iJustRead = useChatWindow((c) => c.iJustRead);
  useEffect(() => {
    if (imNotSignedIn) return;

    const frame = frameRef.current;
    if (!frame) return;

    const iSentThisMessage = myProfileId === message.profile;
    if (iSentThisMessage) return;

    const iHaveAlreadySeenThisMessage = message.seenBy.some(
      (viewer) => viewer.profile === myProfileId,
    );
    if (iHaveAlreadySeenThisMessage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          iJustRead(message._id);
        }
      },
      { threshold: 0.1 },
    );
    observerRef.current = observer;
    observer.observe(frame);
    return () => observer.unobserve(frame);
  }, [myProfileId, message, iJustRead, imNotSignedIn]);

  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      profile: message.profile,
      name: message.name,
      pfp: message.pfp,
      username: message.username,
      content: message.content,
      snapshots: message.snapshots,
      reply: message.reply,
      slug: message.slug,
      seenBy: message.seenBy,
      reactions: message.reactions,
      reactionSignature: message.reactionSignature,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
      frameRef,
      isHovered,
      setIsHovered,
    }),
    [
      message._id,
      message._creationTime,
      message.profile,
      message.name,
      message.pfp,
      message.username,
      message.snapshots,
      message.reply,
      message.slug,
      message.seenBy,
      message.reactions,
      message.reactionSignature,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
      message.content,
      isHovered,
      setIsHovered,
    ],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
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
  const interactionState = useMessage((c) => c.interactionState);
  const frameRef = useMessage((c) => c.frameRef);

  const bgColor =
    interactionState === "editing"
      ? "bg-red-300/20"
      : interactionState === "replying"
        ? "bg-blue-300/20"
        : "transparent hover:bg-muted";

  const setIsHovered = useMessage((c) => c.setIsHovered);

  return (
    <div
      className={cn("group/message relative px-6 py-0.5", className, bgColor)}
      ref={frameRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>;
};

export const PFP = () => {
  const pfp = useMessage((c) => c.pfp);

  const [imageState, setImageState] = useState<"loading" | "error" | "loaded">(
    "loading",
  );

  if (imageState === "error" || !pfp) {
    return (
      <Shapes.Circle className="size-10">
        <UserRound className="text-muted-foreground size-4" />
      </Shapes.Circle>
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

export const Time = ({ time }: { time: string }) => {
  return <div className="text-muted-foreground text-xxs">{time}</div>;
};

export const Header = () => {
  const username = useMessage((c) => c.username);
  const _creationTime = useMessage((c) => c._creationTime);
  const timeStamp = isOverOneDayAgo(_creationTime)
    ? getFullTimestamp(_creationTime)
    : getTimeString(_creationTime);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`https://www.github.com/${username}`}
        target="_blank"
        className="text-sm font-bold"
      >
        {username}
      </Link>
      <Time time={timeStamp} />
    </div>
  );
};

const EditedIndicator = () => {
  return (
    <span className="text-muted-foreground/70 text-xxs ml-1 font-light">
      (edited)
    </span>
  );
};

export const Content = () => {
  const content = useMessage((c) => c.content);
  const isEdited = useMessage((c) => c.snapshots.length > 1);

  if (!content) {
    return (
      <span className="text-muted-foreground/70 text-sm font-medium">
        <i>Deleted message</i>
      </span>
    );
  }

  return (
    <span className="text-muted-foreground text-sm font-medium">
      {content}
      {isEdited && <EditedIndicator />}
    </span>
  );
};

export const Skeleton = ({
  index,
  animate = true,
}: {
  index?: number;
  animate?: boolean;
}) => {
  const numberOfContentLines = index ? (index % 4) + 1 : 3;

  return (
    <div className={cn("mb-4 px-6 py-0.5", animate && "animate-pulse")}>
      <div className="flex gap-3">
        <Shapes.Circle className="size-10" />
        <div className="mt-1 flex w-full flex-col gap-1.5">
          <Shapes.HorizontalBar width={getRandomWidth({ seed: 0 })} />
          {Array.from({ length: numberOfContentLines }, (_, lineIndex) => (
            <Shapes.HorizontalBar
              width={getRandomWidth({ seed: (index ?? 0) + (lineIndex + 1) })}
              key={lineIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SideTime = () => {
  const time = useMessage((c) => c._creationTime);
  return (
    <div className="invisible w-13 flex-shrink-0 group-hover/message:visible">
      <Time time={getTimeString(time)} />
    </div>
  );
};

export const Actions = () => {
  const isNotBeingHovered = useMessage((c) => !c.isHovered);
  const imNotSignedIn = useAuth((c) => !c.imSignedIn);
  const myProfileId = useAuth((c) => c.myProfileId);
  const messageProfileId = useMessage((c) => c.profile);
  const messageIsDeleted = useMessage((c) => c.content === null);

  if (isNotBeingHovered) return null;
  if (imNotSignedIn) return null;
  if (messageIsDeleted) return null;

  const isMyMessage = myProfileId === messageProfileId;

  if (isMyMessage) {
    return <MyMessageActions />;
  }

  return <OtherMessageActions />;
};

const ActionsFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "absolute top-0 right-2 flex -translate-y-5",
        "opacity-0 group-hover/message:opacity-100",
        "pointer-events-none group-hover/message:pointer-events-auto",
      )}
    >
      <ButtonGroup.Frame>{children}</ButtonGroup.Frame>
    </div>
  );
};

const MyMessageActions = () => {
  return (
    <ActionsFrame>
      <ReactionButtons />
      <ReplyButton />
      <EditButton />
      <DeleteButton />
    </ActionsFrame>
  );
};

const OtherMessageActions = () => {
  return (
    <ActionsFrame>
      <ReactionButtons />
      <ReplyButton />
    </ActionsFrame>
  );
};

const EditButton = () => {
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const editComposerInputRef = useMessage((c) => c.editComposerInputRef);
  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button
          variant="outline"
          size="actions"
          onClick={() => {
            setInteractionState("editing");
            setTimeout(() => {
              const input = editComposerInputRef.current;
              if (input) {
                input.focus();
                const length = input.value.length;
                input.setSelectionRange(length, length);
              }
            }, 100);
          }}
        >
          <Pencil className="size-3" />
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Edit message</ToolTip.Content>
    </ToolTip.Frame>
  );
};

const ReplyButton = () => {
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const replyComposerInputRef = useMessage((c) => c.replyComposerInputRef);
  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button
          variant="outline"
          size="actions"
          onClick={() => {
            setInteractionState("replying");
            setTimeout(() => {
              replyComposerInputRef.current?.focus();
            }, 100);
          }}
        >
          <Reply className="size-3" />
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Reply to message</ToolTip.Content>
    </ToolTip.Frame>
  );
};

const DeleteButton = () => {
  const id = useMessage((c) => c._id);
  const { deleteMessage } = useMessageActions();
  return (
    <ToolTip.Frame>
      <ToolTip.Trigger asChild>
        <Button
          variant="outline"
          size="actions"
          onClick={() => deleteMessage({ messageId: id })}
        >
          {" "}
          <Trash className="text-destructive size-3" />{" "}
        </Button>
      </ToolTip.Trigger>
      <ToolTip.Content>Delete message</ToolTip.Content>
    </ToolTip.Frame>
  );
};

export const ReplyPreview = () => {
  const name = useMessage((c) => c.reply?.name);
  const pfp = useMessage((c) => c.reply?.pfp);
  const content = useMessage((c) => c.reply?.content);
  const isEdited = useMessage(
    (c) =>
      c.reply?.content !== null &&
      c.reply?.snapshots.length &&
      c.reply?.snapshots.length > 1,
  );

  const isDeleted = content === null;

  return (
    <div className="mb-0.5 flex h-5 items-center">
      <div className="border-muted-foreground mt-1.5 mr-1 ml-5 h-2.5 w-7 rounded-tl-sm border-t border-l" />
      {pfp && (
        <Image
          src={pfp ?? ""}
          alt={name ?? ""}
          width={16}
          height={16}
          className="mr-1 size-4 flex-shrink-0 rounded-full"
        />
      )}
      <span className="text-muted-foreground max-w-64 truncate text-xs sm:max-w-90">
        {isDeleted ? <i>Deleted message</i> : content}
      </span>
      {isEdited && <EditedIndicator />}
    </div>
  );
};

const ReactionButtons = () => {
  const { reactToMessage } = useMessageActions();
  const reactions = useMessage((c) => c.reactions);
  const messageId = useMessage((c) => c._id);
  const myProfileId = useAuth((c) => c.myProfileId);

  const imNotSignedIn = useAuth((c) => !c.imSignedIn);

  if (imNotSignedIn) return null;

  return REACTION_EMOJIS.map((emoji) => {
    const iveReactedWithThisEmoji = reactions.some(
      (r) => r.profile === myProfileId && r.emoji === emoji,
    );
    return (
      <ToolTip.Frame key={emoji}>
        <ToolTip.Trigger asChild>
          <Button
            variant="outline"
            size="actions"
            onClick={() => reactToMessage({ messageId, emoji })}
          >
            {emoji}
          </Button>
        </ToolTip.Trigger>
        <ToolTip.Content>
          {iveReactedWithThisEmoji ? "Remove reaction" : "React with " + emoji}
        </ToolTip.Content>
      </ToolTip.Frame>
    );
  });
};

export const Reactions = () => {
  const { reactToMessage } = useMessageActions();

  const messageId = useMessage((c) => c._id);
  const reactions = useMessage((c) => c.reactions);

  const myProfileId = useAuth((c) => c.myProfileId);
  const imSignedIn = useAuth((c) => c.imSignedIn);
  const imNotSignedIn = !imSignedIn;

  if (reactions.length === 0) return null;

  const reactionCounts = getReactionCounts(reactions);

  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      {Object.entries(reactionCounts)
        .filter(([_, count]) => count !== undefined && count > 0)
        .map(([emojiString, count]) => {
          const emoji = emojiString as ReactionEmoji;
          const iveReactedWithThisEmoji = reactions.some(
            (r) => r.profile === myProfileId && r.emoji === emoji,
          );
          return (
            <button
              key={emoji}
              onClick={() => {
                if (imNotSignedIn) return;
                reactToMessage({ messageId, emoji });
              }}
              disabled={imNotSignedIn}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                iveReactedWithThisEmoji
                  ? "border-primary bg-primary/10 hover:bg-primary/20"
                  : "border-border bg-background hover:bg-muted",
                imSignedIn && "cursor-pointer",
              )}
            >
              <span>{emoji}</span>
              <span className="text-muted-foreground">{count}</span>
            </button>
          );
        })}
    </div>
  );
};
