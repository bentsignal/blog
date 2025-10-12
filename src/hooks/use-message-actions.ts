import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/auth";

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
              reply = {
                ...replyToMessage,
                name: replyToMessage.name,
                pfp: replyToMessage.pfp ?? null,
              };
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
          channel: "optimistic-channel" as Id<"channels">,
          snapshots: [
            {
              content: args.content,
              timestamp: Date.now(),
            },
          ],
          reply,
        };
        localStore.setQuery(
          api.messages.get,
          {
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
        const results = localStore.getAllQueries(api.messages.get);
        for (const result of results) {
          if (!result || !result.value) continue;
          const hasTargetMessage = result.value.page?.some(
            (message) => message._id === args.messageId,
          );
          if (!hasTargetMessage) continue;
          localStore.setQuery(
            api.messages.get,
            { paginationOpts: result.args.paginationOpts },
            {
              ...result.value,
              page: result.value.page?.map((message) =>
                message._id === args.messageId
                  ? {
                      ...message,
                      snapshots: [
                        ...message.snapshots,
                        { content: args.content, timestamp: Date.now() },
                      ],
                    }
                  : message,
              ),
            },
          );
          break;
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
            (message) => message._id === args.messageId,
          );
          if (!hasTargetMessage) continue;
          localStore.setQuery(
            api.messages.get,
            { paginationOpts: result.args.paginationOpts },
            {
              ...result.value,
              page: result.value.page?.filter(
                (message) => message._id !== args.messageId,
              ),
            },
          );
          break;
        }
      },
    ),
    onError: toastError,
  });

  return {
    sendMessage,
    editMessage,
    deleteMessage,
  };
};
