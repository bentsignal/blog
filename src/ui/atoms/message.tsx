"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useMessage } from "@/context/message-context";
import {
  getFullTimestamp,
  getTimeString,
  isOverOneDayAgo,
} from "@/utils/time-utils";
import { cn } from "@/utils/utils";
import { Pencil, Reply, Trash, UserRound } from "lucide-react";
import Image from "next/image";
import { Button } from "../external/button";
import { ButtonGroup } from "../external/button-group";
import * as ToolTip from "../external/tooltip";
import * as Shapes from "./shapes";
import { useMessageActions } from "@/hooks/use-message-actions";

export const Frame = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const interactionState = useMessage((c) => c.interactionState);

  const bgColor =
    interactionState === "editing"
      ? "bg-red-300/20"
      : interactionState === "replying"
        ? "bg-blue-300/20"
        : "transparent hover:bg-muted";

  return (
    <div className={cn("group relative px-6 py-0.5", className, bgColor)}>
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
  const latestContent = useMessage(
    (c) => c.snapshots[c.snapshots.length - 1].content,
  );
  const isEdited = useMessage((c) => c.snapshots.length > 1);
  return (
    <span className="text-muted-foreground text-sm font-medium">
      {latestContent}
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
  const time = useMessage((c) => c._creationTime);
  return (
    <div className="invisible w-13 flex-shrink-0 group-hover:visible">
      <Time time={getTimeString(time)} />
    </div>
  );
};

export const Actions = () => {
  const isSignedIn = useAuth((c) => c.signedIn);
  const myProfileId = useAuth((c) => c.myProfileId);
  const messageProfileId = useMessage((c) => c.profile);

  if (!isSignedIn) return null;

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
        "opacity-0 group-hover:opacity-100",
        "pointer-events-none group-hover:pointer-events-auto",
      )}
    >
      <ButtonGroup>{children}</ButtonGroup>
    </div>
  );
};

const MyMessageActions = () => {
  return (
    <ActionsFrame>
      <ReplyButton />
      <EditButton />
      <DeleteButton />
    </ActionsFrame>
  );
};

const OtherMessageActions = () => {
  return (
    <ActionsFrame>
      <ReplyButton />
    </ActionsFrame>
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

export const ReplyPreview = () => {
  const name = useMessage((c) => c.reply?.name);
  const pfp = useMessage((c) => c.reply?.pfp);
  const latestContent = useMessage(
    (c) => c.reply?.snapshots[c.reply?.snapshots.length - 1].content,
  );
  const isEdited = useMessage(
    (c) => c.reply?.snapshots.length && c.reply?.snapshots.length > 1,
  );

  return (
    <div className="mb-0.5 flex h-5 items-center">
      <div className="border-muted-foreground mt-1.5 mr-1 ml-5 h-2.5 w-7 rounded-tl-sm border-t border-l" />
      {pfp && (
        <Image
          src={pfp ?? ""}
          alt={name ?? ""}
          width={40}
          height={40}
          className="mr-1 size-4 flex-shrink-0 rounded-full"
        />
      )}
      <span className="text-muted-foreground max-w-64 truncate text-xs">
        {latestContent}
      </span>
      {isEdited && <EditedIndicator />}
    </div>
  );
};
