import {
  Context,
  ContextSelector,
  createContext as createSelectorContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";

export const createContext = <T>({ displayName }: { displayName: string }) => {
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

const useVerifyContextExistsInTree = (context: Context<any>) => {
  const hasContext = useHasParentContext(context);
  if (!hasContext) {
    const contextName = context.displayName || "Unknown Context";
    throw new Error(`${contextName} is required but not found.`);
  }
};
