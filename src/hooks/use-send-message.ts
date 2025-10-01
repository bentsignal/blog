import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useAuth } from "@/components/auth";

export const useSendMessage = () => {
  const image = useAuth((c) => c.image);
  const name = useAuth((c) => c.name);

  const sendMessage = useMutation(
    api.messages.sendMessage,
  ).withOptimisticUpdate((localStore, args) => {
    const results = localStore.getAllQueries(api.messages.getMessages);
    const current = results[0];
    if (!current || !current.value) return;
    localStore.setQuery(
      api.messages.getMessages,
      {
        paginationOpts: current.args.paginationOpts,
      },
      {
        ...current.value,
        page: [
          {
            name: name || "",
            pfp: image,
            _id: ("optimistic-" +
              Math.random().toString(36).slice(2)) as Id<"messages">,
            // + 50 ms to account for delay in server saving message
            _creationTime: Date.now() + 50,
            content: args.content,
          },
          ...(current.value.page || []),
        ],
        isDone: current.value.isDone ?? false,
        continueCursor: current.value.continueCursor ?? "",
      },
    );
  });

  return {
    sendMessage,
  };
};
