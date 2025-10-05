import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/auth";

export const useSendMessage = () => {
  const image = useAuth((c) => c.image);
  const name = useAuth((c) => c.name);

  const { mutate: sendMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.send).withOptimisticUpdate(
      (localStore, args) => {
        const results = localStore.getAllQueries(api.messages.get);
        const current = results[0];
        if (!current || !current.value) return;
        const newMessage = {
          name: name || "",
          pfp: image,
          _id: ("optimistic-" +
            Math.random().toString(36).slice(2)) as Id<"messages">,
          _creationTime: Date.now(),
          snapshots: [
            {
              content: args.content,
              timestamp: Date.now(),
            },
          ],
        };
        localStore.setQuery(
          api.messages.get,
          {
            paginationOpts: current.args.paginationOpts,
          },
          {
            ...current.value,
            page: [newMessage, ...(current.value.page || [])],
            isDone: current.value.isDone ?? false,
            continueCursor: current.value.continueCursor ?? "",
          },
        );
      },
    ),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to send message", {
        description: "Something went wrong, see console for more details.",
      });
    },
  });

  return {
    sendMessage,
  };
};
