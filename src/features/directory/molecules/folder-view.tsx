import * as Directory from "@/features/directory/atom";
import type { FolderType } from "../types";
import * as Frame from "@/atoms/frame";

const FolderView = ({ directory }: { directory: FolderType }) => {
  return (
    <Directory.Provider initialRoot={directory}>
      <Frame.Container>
        <Frame.Header>
          <Directory.FolderIdentifier />
          <div className="flex items-center gap-2">
            <Directory.CloseAllButton />
            <Directory.OpenAllButton />
          </div>
        </Frame.Header>
        <Frame.Body>
          <Directory.List />
        </Frame.Body>
      </Frame.Container>
    </Directory.Provider>
  );
};

export { FolderView };
