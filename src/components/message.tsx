"use client";

import { memo, useMemo, useRef, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import { Pencil, Reply, Trash, UserRound } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "./auth";
import * as Composer from "./composer";
import { ListContext, useList } from "./list";
import * as Shapes from "./shapes";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import * as ToolTip from "./ui/tooltip";
import { getFullTimestamp, getTimeString, isOverOneDayAgo } from "@/lib/time";
import { cn, validateMessage } from "@/lib/utils";
import { useMessageActions } from "@/hooks/use-message-actions";

export interface Message extends Doc<"messages"> {
  name: string;
  pfp: string | null | undefined;
  reply?: Message;
}

type InteractionState = "idle" | "editing" | "replying";

interface MessageContextType extends Message {
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
  interactionState: InteractionState;
  setInteractionState: (interactionState: InteractionState) => void;
  editComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  replyComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
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
  const editComposerInputRef = useRef<HTMLTextAreaElement>(null);
  const [interactionState, setInteractionState] =
    useState<InteractionState>("idle");
  const replyComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      profile: message.profile,
      name: message.name,
      pfp: message.pfp,
      snapshots: message.snapshots,
      channel: message.channel,
      reply: message.reply,
      isHovering,
      setIsHovering,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
    }),
    [message, isHovering, setIsHovering, interactionState, setInteractionState],
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
  const setIsHovering = useMessage((c) => c.setIsHovering);
  const interactionState = useMessage((c) => c.interactionState);

  const bgColor =
    interactionState === "editing"
      ? "bg-red-300/20"
      : interactionState === "replying"
        ? "bg-blue-300/20"
        : "transparent hover:bg-muted";

  return (
    <div
      className={cn("relative px-6 py-0.5", className, bgColor)}
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

const EditedIndicator = () => {
  return (
    <span className="text-muted-foreground/70 text-xxs ml-1 font-light">
      (edited)
    </span>
  );
};

export const Content = () => {
  const snapshots = useMessage((c) => c.snapshots);
  const isEdited = snapshots?.length && snapshots.length > 1;
  return (
    <span className="text-muted-foreground text-sm font-medium">
      {snapshots[snapshots.length - 1].content}
      {isEdited && <EditedIndicator />}
    </span>
  );
};

export const Skeleton = ({ index }: { index?: number }) => {
  const numberOfContentLines = index ? (index % 4) + 1 : 3;
  return (
    <div className="mb-4 animate-pulse px-6 py-0.5">
      <div className="flex gap-3">
        <Shapes.Circle className="size-10" />
        <div className="mt-1 flex w-full flex-col gap-1.5">
          <Shapes.HorizontalBar width={Math.random() * 150 + 50} />
          {Array.from({ length: numberOfContentLines }, (_, index) => (
            <Shapes.HorizontalBar
              width={Math.random() * 150 + 50}
              key={index}
            />
          ))}
        </div>
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

  return <OtherMessageActions />;
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
      <ReplyButton />
      <EditButton />
      <DeleteButton />
    </ActionFrame>
  );
};

const OtherMessageActions = () => {
  return (
    <ActionFrame>
      <ReplyButton />
    </ActionFrame>
  );
};

const EditButton = () => {
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const editComposerInputRef = useMessage((c) => c.editComposerInputRef);
  return (
    <ToolTip.Tooltip>
      <ToolTip.TooltipTrigger asChild>
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
      </ToolTip.TooltipTrigger>
      <ToolTip.TooltipContent>Edit message</ToolTip.TooltipContent>
    </ToolTip.Tooltip>
  );
};

const ReplyButton = () => {
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const replyComposerInputRef = useMessage((c) => c.replyComposerInputRef);
  return (
    <ToolTip.Tooltip>
      <ToolTip.TooltipTrigger asChild>
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
      </ToolTip.TooltipTrigger>
      <ToolTip.TooltipContent>Reply to message</ToolTip.TooltipContent>
    </ToolTip.Tooltip>
  );
};

const DeleteButton = () => {
  const id = useMessage((c) => c._id);
  const { deleteMessage } = useMessageActions();
  return (
    <ToolTip.Tooltip>
      <ToolTip.TooltipTrigger asChild>
        <Button
          variant="outline"
          size="actions"
          onClick={() => deleteMessage({ messageId: id })}
        >
          {" "}
          <Trash className="text-destructive size-3" />{" "}
        </Button>
      </ToolTip.TooltipTrigger>
      <ToolTip.TooltipContent>Delete message</ToolTip.TooltipContent>
    </ToolTip.Tooltip>
  );
};

export const ReplyInline = () => {
  const interactionState = useMessage((c) => c.interactionState);
  if (interactionState !== "replying") return null;

  return <ReplyComposer />;
};

export const EditInline = () => {
  const interactionState = useMessage((c) => c.interactionState);
  if (interactionState !== "editing") return null;

  return <EditComposer />;
};

export const ReplyPreview = () => {
  const reply = useMessage((c) => c.reply);
  if (!reply) return null;

  const isEdited = reply.snapshots.length > 1;

  return (
    <div className="mb-0.5 flex h-5 items-center">
      <div className="border-muted-foreground mt-1.5 mr-1 ml-5 h-2.5 w-7 rounded-tl-sm border-t border-l" />
      {reply.pfp && (
        <Image
          src={reply.pfp ?? ""}
          alt={reply.name ?? ""}
          width={40}
          height={40}
          className="mr-1 size-4 flex-shrink-0 rounded-full"
        />
      )}
      <span className="text-muted-foreground max-w-64 truncate text-xs">
        {reply.snapshots[reply.snapshots.length - 1].content}
      </span>
      {isEdited && <EditedIndicator />}
    </div>
  );
};

export const InlineComposers = () => {
  return (
    <>
      <ReplyInline />
      <EditInline />
    </>
  );
};

export const EditComposer = () => {
  const hasParentContext = useHasParentContext(MessageContext);
  if (!hasParentContext) {
    throw new Error("MessageContext not found");
  }

  const snapshots = useMessage((c) => c.snapshots);
  const messageId = useMessage((c) => c._id);
  const inputRef = useMessage((c) => c.editComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const setIsHovering = useMessage((c) => c.setIsHovering);
  const { editMessage } = useMessageActions();

  const [inputValue, setInputValue] = useState(
    snapshots[snapshots.length - 1].content,
  );

  const previousContent = snapshots[snapshots.length - 1].content;

  return (
    <Composer.Provider
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
      onSubmit={() => {
        const newValue = inputRef.current?.value ?? "";
        const validation = validateMessage(newValue);
        if (validation !== "Valid") {
          toast.error(validation);
          return;
        }
        if (previousContent !== newValue) {
          editMessage({
            messageId: messageId,
            content: newValue,
          });
        }
        setInteractionState("idle");
        setIsHovering(false);
      }}
      onCancel={() => {
        setIsHovering(false);
        setInteractionState("idle");
      }}
    >
      <Composer.Frame className="my-3 rounded-none px-6">
        <Composer.Input placeholder={previousContent} />
        <ButtonGroup>
          <Composer.Cancel />
          <Composer.Save />
        </ButtonGroup>
      </Composer.Frame>
    </Composer.Provider>
  );
};

export const ReplyComposer = () => {
  const hasMessageContext = useHasParentContext(MessageContext);
  if (!hasMessageContext) {
    throw new Error("MessageContext not found");
  }

  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const messageId = useMessage((c) => c._id);
  const channel = useMessage((c) => c.channel);
  const inputRef = useMessage((c) => c.replyComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const setIsHovering = useMessage((c) => c.setIsHovering);
  const name = useMessage((c) => c.name);

  const scrollToBottom = useList((c) => c.scrollToBottom);
  const mainComposerInputRef = useList((c) => c.mainComposerInputRef);

  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useMessageActions();

  return (
    <Composer.Provider
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
      onSubmit={() => {
        const newValue = inputRef.current?.value ?? "";
        const validation = validateMessage(newValue);
        if (validation !== "Valid") {
          toast.error(validation);
          return;
        }
        sendMessage({
          content: newValue,
          channel: channel,
          replyTo: messageId,
        });
        setInteractionState("idle");
        setIsHovering(false);
        mainComposerInputRef?.current?.focus();
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }}
      onCancel={() => {
        setIsHovering(false);
        setInteractionState("idle");
      }}
    >
      <Composer.InlineHeader>
        Replying to <span className="font-semibold">{name}</span>
      </Composer.InlineHeader>
      <Composer.Frame className="mb-3 rounded-none px-6">
        <Composer.Input />
        <ButtonGroup>
          <Composer.Cancel />
          <Composer.Send />
        </ButtonGroup>
      </Composer.Frame>
    </Composer.Provider>
  );
};

export const UserMessage = memo(
  ({ message }: { message: Message }) => {
    return (
      <Provider message={message}>
        <Frame className="mt-3">
          <div className="flex gap-3">
            <PFP />
            <div className="flex flex-col">
              <Header />
              <Content />
            </div>
          </div>
          <Actions />
        </Frame>
        <InlineComposers />
      </Provider>
    );
  },
  (prev, next) => {
    if (prev.message.name !== next.message.name) return false;
    if (prev.message.pfp !== next.message.pfp) return false;
    if (
      prev.message.snapshots[prev.message.snapshots.length - 1].content !==
      next.message.snapshots[next.message.snapshots.length - 1].content
    )
      return false;
    return true;
  },
);

export const ChainedMessage = memo(
  ({ message }: { message: Message }) => {
    return (
      <Provider message={message}>
        <Frame>
          <div className="flex items-center">
            <SideTime />
            <Content />
          </div>
          <Actions />
        </Frame>
        <InlineComposers />
      </Provider>
    );
  },
  (prev, next) => {
    if (prev.message.name !== next.message.name) return false;
    if (prev.message.pfp !== next.message.pfp) return false;
    if (
      prev.message.snapshots[prev.message.snapshots.length - 1].content !==
      next.message.snapshots[next.message.snapshots.length - 1].content
    )
      return false;
    return true;
  },
);

export const ReplyMessage = memo(
  ({ message }: { message: Message }) => {
    return (
      <Provider message={message}>
        <Frame className="mt-3">
          <div className="flex flex-col">
            <ReplyPreview />
            <div className="flex gap-3">
              <PFP />
              <div className="flex flex-col">
                <Header />
                <Content />
              </div>
            </div>
          </div>
          <Actions />
        </Frame>
        <InlineComposers />
      </Provider>
    );
  },
  (prev, next) => {
    if (prev.message.name !== next.message.name) return false;
    if (prev.message.pfp !== next.message.pfp) return false;
    if (
      prev.message.snapshots[prev.message.snapshots.length - 1].content !==
      next.message.snapshots[next.message.snapshots.length - 1].content
    )
      return false;
    if (
      prev.message.reply?.snapshots[prev.message.reply?.snapshots.length - 1]
        .content !==
      next.message.reply?.snapshots[next.message.reply?.snapshots.length - 1]
        .content
    )
      return false;
    if (prev.message.reply?.name !== next.message.reply?.name) return false;
    return true;
  },
);
