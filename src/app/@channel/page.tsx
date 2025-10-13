import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import * as Channel from "@/components/channel";
import * as Card from "@/components/ui/card";

export default async function ChannelPage() {
  const channel = await fetchQuery(api.channel.getDefault);
  return (
    <Card.Card className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-0">
      <Card.CardContent className="flex h-full flex-col p-0">
        <Channel.Provider channel={channel}>
          <Channel.Header />
          <Channel.Body />
        </Channel.Provider>
      </Card.CardContent>
    </Card.Card>
  );
}
