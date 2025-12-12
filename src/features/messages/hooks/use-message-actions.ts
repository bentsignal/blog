import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRequiredContext } from "@/lib/context";
import * as Auth from "@/features/auth/atom";
import { getReactionsSignature } from "@/features/messages/utils";

const useMessageActions = () => {
  useRequiredContext(Auth.Context);

  const image = Auth.useContext((c) => c.image);
  const name = Auth.useContext((c) => c.name);
  const username = Auth.useContext((c) => c.username);
  const myProfileId = Auth.useContext((c) => c.myProfileId);

  const toastError = (error: Error) => {
    console.error(error);
    toast.error("Oops, something went wrong", {
      description: "See console for more details.",
    });
  };

  const { mutate: sendMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.send).withOptimisticUpdate(
      (localStore, args) => {
        const results = localStore.getAllQueries(api.messages.getPage);
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
          username: username ?? "",
          _id: ("optimistic-" +
            Math.random().toString(36).slice(2)) as Id<"messages">,
          _creationTime: Date.now(),
          profile: myProfileId as Id<"profiles">,
          slug: args.slug,
          content: args.content,
          snapshots: [
            {
              content: args.content,
              timestamp: Date.now(),
            },
          ],
          seenBy: [],
          reactions: [],
          reactionSignature: "",
          reply,
        };
        localStore.setQuery(
          api.messages.getPage,
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
        const results = localStore.getAllQueries(api.messages.getPage);
        for (const result of results) {
          if (!result || !result.value) continue;
          const hasTargetMessage = result.value.page?.some(
            (message) =>
              message._id === args.messageId ||
              message.reply?._id === args.messageId,
          );
          if (!hasTargetMessage) continue;
          localStore.setQuery(
            api.messages.getPage,
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
                      content: args.content,
                      snapshots: [...message.snapshots, newSnapshot],
                    }
                  : message.reply?._id === args.messageId
                    ? {
                        ...message,
                        reply: {
                          ...message.reply,
                          content: args.content,
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
        const results = localStore.getAllQueries(api.messages.getPage);
        for (const result of results) {
          if (!result || !result.value) continue;
          const hasTargetMessage = result.value.page?.some(
            (message) =>
              message._id === args.messageId ||
              message.reply?._id === args.messageId,
          );
          if (hasTargetMessage) {
            localStore.setQuery(
              api.messages.getPage,
              {
                slug: result.args.slug,
                paginationOpts: result.args.paginationOpts,
              },
              {
                ...result.value,
                page: result.value.page
                  .filter((message) => message._id !== args.messageId)
                  .map((message) => {
                    if (message.reply?._id === args.messageId) {
                      return {
                        ...message,
                        reply: {
                          ...message.reply,
                          content: null,
                          snapshots: [],
                        },
                      };
                    }
                    return message;
                  }),
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

  const { mutate: reactToMessage } = useMutation({
    mutationFn: useConvexMutation(
      api.messages.toggleReaction,
    ).withOptimisticUpdate((localStore, args) => {
      const results = localStore.getAllQueries(api.messages.getPage);
      for (const result of results) {
        if (result.value === undefined) continue;
        const hasTargetMessage = result.value.page.some(
          (message) => message._id === args.messageId,
        );
        if (!hasTargetMessage) continue;
        localStore.setQuery(
          api.messages.getPage,
          {
            slug: result.args.slug,
            paginationOpts: result.args.paginationOpts,
          },
          {
            ...result.value,
            page: result.value.page.map((message) => {
              if (message._id !== args.messageId) return message;
              const iveReactedWithThisEmojiAlready = message.reactions.some(
                (r) => r.profile === myProfileId && r.emoji === args.emoji,
              );
              let updatedReactions;
              if (iveReactedWithThisEmojiAlready) {
                updatedReactions = message.reactions.filter(
                  (r) => !(r.profile === myProfileId && r.emoji === args.emoji),
                );
              } else {
                updatedReactions = [
                  ...message.reactions,
                  {
                    profile: myProfileId as Id<"profiles">,
                    emoji: args.emoji,
                  },
                ];
              }
              const updatedReactionSignature =
                getReactionsSignature(updatedReactions);
              return {
                ...message,
                reactions: updatedReactions,
                reactionSignature: updatedReactionSignature,
              };
            }),
          },
        );
      }
    }),
    onError: toastError,
  });

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    reactToMessage,
  };
};

export { useMessageActions };
