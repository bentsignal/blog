"use client";

import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import { getTimeString } from "@/lib/utils";

export type Message = {
  id: number;
  user: string;
  content: string;
  createdAt: Date;
};

interface MessageContextType {
  message: Message;
}

export const MessageContext = createContext<MessageContextType>(
  {} as MessageContextType,
);

export const useMessageContext = <T,>(
  selector: ContextSelector<MessageContextType, T>,
) => useContextSelector(MessageContext, selector);

export const Provider = ({
  message,
  children,
}: {
  message: Message;
  children: React.ReactNode;
}) => {
  return (
    <MessageContext.Provider value={{ message }}>
      {children}
    </MessageContext.Provider>
  );
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-2">{children}</div>;
};

export const PFP = () => {
  return <div className="bg-muted size-10 flex-shrink-0 rounded-md" id="pfp" />;
};

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>;
};

export const Header = () => {
  const message = useMessageContext((c) => c.message);
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold">{message.user}</div>
      <div className="text-muted-foreground text-xs">
        {getTimeString(message.createdAt)}
      </div>
    </div>
  );
};

export const Content = () => {
  const message = useMessageContext((c) => c.message);
  return <div className="text-sm">{message.content}</div>;
};
