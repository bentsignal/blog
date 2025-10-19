import * as ListContext from "@/context/list-context";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import { TopControls } from "@/ui/molecules/top-controls";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListContext.Provider>
      <List.Frame>
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <List.Content className="prose max-h-screen">{children}</List.Content>
        <div className="absolute right-0 bottom-0 z-6 flex flex-col gap-2 p-4">
          <List.ScrollToTopButton />
          <List.ScrollToBottomButton />
        </div>
        <Abyss.Bottom />
      </List.Frame>
    </ListContext.Provider>
  );
}
