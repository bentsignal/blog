import { Provider as ChannelProvider } from "@/context/channel-context";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import * as Card from "@/ui/atoms/card";

export default async function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const channel = await fetchQuery(api.channel.getDefault);
  return (
    <Card.Frame className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-0">
      <Card.Content className="flex h-full flex-col p-0">
        <ChannelProvider channel={channel}>{children}</ChannelProvider>
      </Card.Content>
    </Card.Frame>
  );
}
