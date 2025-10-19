import * as ListContext from "@/context/list-context";
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
        <TopControls />
        <List.Content className="prose max-h-screen">{children}</List.Content>
      </List.Frame>
    </ListContext.Provider>
  );
}
