import { useMemo } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

type ChannelContextType = {
  channel?: Doc<"channels">;
};

export const ChannelContext = createContext<ChannelContextType>(
  {} as ChannelContextType,
);

export const useChannel = <T,>(
  selector: ContextSelector<ChannelContextType, T>,
) => useContextSelector(ChannelContext, selector);

export const ChannelProvider = ({
  channel,
  children,
}: {
  children: React.ReactNode;
  channel?: Doc<"channels">;
}) => {
  const contextValue = useMemo(() => ({ channel }), [channel]);
  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};
