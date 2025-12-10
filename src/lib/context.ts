"use client";

import {
  Context,
  ContextSelector,
  createContext as createSelectorContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";

const createContext = <T extends object>({
  displayName,
}: {
  displayName: string;
}) => {
  const Context = createSelectorContext<T>({} as T);
  Context.displayName = displayName;
  const use = <U>(selector: ContextSelector<T, U>) =>
    useContextSelector(Context, selector);
  return {
    Context,
    use,
  };
};

const useRequiredContext = (context: Context<any>) => {
  const hasContext = useHasParentContext(context);
  if (!hasContext) {
    const contextName = context.displayName || "Unknown Context";
    throw new Error(`${contextName} is required but not found.`);
  }
};

export { createContext, useRequiredContext };
