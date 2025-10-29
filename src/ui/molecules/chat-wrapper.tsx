import * as ChatContext from "@/context/chat-context";
import * as ListContext from "@/context/list-context";
import { Doc } from "@/convex/_generated/dataModel";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import * as Sidebar from "@/ui/atoms/sidebar";
import { ChatWindow } from "@/ui/molecules/chat-window";
import { TopControls } from "@/ui/molecules/top-controls";

export default async function ChatWrapper({
  channel,
  children,
}: {
  channel?: Doc<"channels">;
  children: React.ReactNode;
}) {
  return (
    <ChatContext.Provider channel={channel}>
      <Sidebar.Frame className="max-w-screen sm:max-w-lg">
        <Sidebar.Content className="flex items-center">
          <ChatWindow />
        </Sidebar.Content>
      </Sidebar.Frame>
      <ListContext.Provider>
        <List.Frame>
          <TopControls className="absolute top-0 left-0 z-6" />
          <Abyss.Top />
          <List.Content className="max-h-screen mask-t-from-97% mask-b-from-97%">
            {children}
          </List.Content>
          <div className="absolute right-0 bottom-0 z-6 flex flex-col gap-2 p-4">
            <List.ScrollToTopButton />
            <List.ScrollToBottomButton />
          </div>
          <Abyss.Bottom />
        </List.Frame>
      </ListContext.Provider>
    </ChatContext.Provider>
  );
}
