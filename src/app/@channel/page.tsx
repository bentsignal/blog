import { api } from "@/convex/_generated/api";
import { ChannelTemplate } from "@/ui/templates/channel-template";
import { fetchQuery } from "convex/nextjs";

export default async function ChannelPage() {
  const channel = await fetchQuery(api.channel.getDefault);
  return <ChannelTemplate channel={channel} />;
}
