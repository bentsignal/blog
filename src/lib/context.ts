import {
  Context,
  ContextSelector,
  createContext as createSelectorContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";

export const createContext = <T extends object>({
  displayName,
}: {
  displayName: string;
}) => {
  const Context = createSelectorContext<T>({} as T);
  Context.displayName = displayName;
  const useContext = <U>(selector: ContextSelector<T, U>) =>
    useContextSelector(Context, selector);
  return {
    Context,
    useContext,
  };
};

export const useRequiredContext = (contexts: Context<any> | Context<any>[]) => {
  if (Array.isArray(contexts)) {
    contexts.forEach((context) => useVerifyContextExistsInTree(context));
  } else {
    useVerifyContextExistsInTree(contexts);
  }
};

export const useOptionalContext = (contexts: Context<any> | Context<any>[]) => {
  if (Array.isArray(contexts)) {
    contexts.forEach((context) => useVerifyContextExistsInTree(context, false));
  } else {
    useVerifyContextExistsInTree(contexts, false);
  }
};

const useVerifyContextExistsInTree = (
  context: Context<any>,
  required: boolean = true,
) => {
  const hasContext = useHasParentContext(context);
  if (hasContext) return;
  if (required) {
    const contextName = context.displayName || "Unknown Context";
    throw new Error(`${contextName} is required but not found.`);
  }
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `${context.displayName} is listed as optional, but not found.`,
    );
  }
};
