import { useAuth } from "@/context/auth-context";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMessageActions = () => {
  const image = useAuth((c) => c.image);
  const name = useAuth((c) => c.name);
  const myProfileId = useAuth((c) => c.myProfileId);

  const toastError = (error: Error) => {
    console.error(error);
    toast.error("Oops, something went wrong", {
      description: "See console for more details.",
    });
  };

  const { mutate: sendMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.send).withOptimisticUpdate(
      (localStore, args) => {
        const results = localStore.getAllQueries(api.messages.get);
        const current = results[0];
        if (!current || !current.value) return;

        let reply = undefined;
        if (args.replyTo) {
          for (const result of results) {
            if (!result || !result.value) continue;
            const replyToMessage = result.value.page.find(
              (msg) => msg._id === args.replyTo,
            );
            if (replyToMessage) {
              const { replyTo: _, ...messageWithoutReplyTo } = replyToMessage;
              reply = messageWithoutReplyTo;
              break;
            }
          }
        }

        const newMessage = {
          name: name ?? "",
          pfp: image,
          _id: ("optimistic-" +
            Math.random().toString(36).slice(2)) as Id<"messages">,
          _creationTime: Date.now(),
          profile: myProfileId as Id<"profiles">,
          slug: args.slug,
          snapshots: [
            {
              content: args.content,
              timestamp: Date.now(),
            },
          ],
          seenBy: [],
          reply,
        };
        localStore.setQuery(
          api.messages.get,
          {
            slug: current.args.slug,
            paginationOpts: current.args.paginationOpts,
          },
          {
            ...current.value,
            page: [newMessage, ...current.value.page],
          },
        );
      },
    ),
    onError: toastError,
  });

  const { mutate: editMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.edit).withOptimisticUpdate(
      (localStore, args) => {
        const newSnapshot = { content: args.content, timestamp: Date.now() };
        const results = localStore.getAllQueries(api.messages.get);
        for (const result of results) {
          if (!result || !result.value) continue;
          const hasTargetMessage = result.value.page?.some(
            (message) =>
              message._id === args.messageId ||
              message.reply?._id === args.messageId,
          );
          if (!hasTargetMessage) continue;
          localStore.setQuery(
            api.messages.get,
            {
              slug: result.args.slug,
              paginationOpts: result.args.paginationOpts,
            },
            {
              ...result.value,
              page: result.value.page?.map((message) =>
                message._id === args.messageId
                  ? {
                      ...message,
                      snapshots: [...message.snapshots, newSnapshot],
                    }
                  : message.reply?._id === args.messageId
                    ? {
                        ...message,
                        reply: {
                          ...message.reply,
                          snapshots: [...message.reply.snapshots, newSnapshot],
                        },
                      }
                    : message,
              ),
            },
          );
        }
      },
    ),
    onError: toastError,
  });

  const { mutate: deleteMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteOne).withOptimisticUpdate(
      (localStore, args) => {
        const results = localStore.getAllQueries(api.messages.get);
        for (const result of results) {
          if (!result || !result.value) continue;
          const hasTargetMessage = result.value.page?.some(
            (message) =>
              message._id === args.messageId ||
              message.reply?._id === args.messageId,
          );
          if (hasTargetMessage) {
            localStore.setQuery(
              api.messages.get,
              {
                slug: result.args.slug,
                paginationOpts: result.args.paginationOpts,
              },
              {
                ...result.value,
                page: result.value.page
                  ?.filter((message) => message._id !== args.messageId)
                  .map((message) =>
                    message.reply?._id === args.messageId
                      ? { ...message, reply: undefined }
                      : message,
                  ),
              },
            );
          }
        }
      },
    ),
    onError: toastError,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: useConvexMutation(api.messages.markAsRead),
    onError: toastError,
  });

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
  };
};
