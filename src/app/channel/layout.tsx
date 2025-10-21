import { Provider as ChannelProvider } from "@/context/channel-context";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export default async function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const channel = await fetchQuery(api.channel.getDefault);
  return <ChannelProvider channel={channel}>{children}</ChannelProvider>;
}
