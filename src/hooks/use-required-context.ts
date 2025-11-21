import { Context, useHasParentContext } from "@fluentui/react-context-selector";

export const useRequiredContext = (contexts: Context<any> | Context<any>[]) => {
  if (Array.isArray(contexts)) {
    contexts.forEach((context) => verifyContextExistsInTree(context));
  } else {
    verifyContextExistsInTree(contexts);
  }
};

const verifyContextExistsInTree = (context: Context<any>) => {
  const hasContext = useHasParentContext(context);
  if (!hasContext) {
    const contextName = context.displayName || "Unknown Context";
    throw new Error(`${contextName} is required but not found.`);
  }
};
