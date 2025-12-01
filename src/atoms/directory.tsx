"use client";

import { memo, useCallback, useState } from "react";
import { cn } from "@/utils/style-utils";
import equal from "fast-deep-equal";
import { ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";
import { Button } from "@/atoms/button";
import * as Tooltip from "@/atoms/tooltip";
import { createContext, useRequiredContext } from "@/lib/context";

type Extension = "ts" | "tsx";

type FileType = {
  name: string;
  type: Extension;
};

type FolderType = {
  name: string;
  contents: Array<FileType | FolderType>;
  isOpen?: boolean;
};

const { Context: DirectoryContext, useContext: useDirectory } = createContext<{
  root: FolderType;
  openOrCloseFolder: (
    path: Array<string>,
    folderName: string,
    newValue: "open" | "closed",
  ) => void;
}>({ displayName: "DirectoryContext" });

const Provider = ({
  initialRoot,
  children,
}: {
  initialRoot: FolderType;
  children: React.ReactNode;
}) => {
  const [root, setRoot] = useState(initialRoot);

  const openOrCloseFolder = useCallback(
    (path: Array<string>, folderName: string, newValue: "open" | "closed") => {
      const updateFolder = (
        folder: FolderType,
        pathSegments: Array<string>,
      ): FolderType => {
        if (pathSegments.length === 0) {
          return folder;
        }

        if (pathSegments.length === 1) {
          if (folder.name === pathSegments[0] && folder.name === folderName) {
            return {
              ...folder,
              isOpen: newValue === "open",
            };
          }

          const updatedContents = folder.contents.map((item) => {
            if (
              "contents" in item &&
              item.name === pathSegments[0] &&
              item.name === folderName
            ) {
              return {
                ...item,
                isOpen: newValue === "open",
              };
            }
            return item;
          });

          return {
            ...folder,
            contents: updatedContents,
          };
        }

        const [currentSegment, ...remainingSegments] = pathSegments;

        const updatedContents = folder.contents.map((item) => {
          if ("contents" in item && item.name === currentSegment) {
            return updateFolder(item, remainingSegments);
          }
          return item;
        });

        return {
          ...folder,
          contents: updatedContents,
        };
      };

      setRoot((prevRoot) => {
        if (path.length > 0 && path[0] === prevRoot.name) {
          return updateFolder(prevRoot, path.slice(1));
        }
        return updateFolder(prevRoot, path);
      });
    },
    [],
  );

  const contextValue = { root, openOrCloseFolder };

  return (
    <DirectoryContext.Provider value={contextValue}>
      {children}
    </DirectoryContext.Provider>
  );
};

const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="not-prose border-border bg-card/50 group relative my-8 w-full overflow-hidden rounded-xl border-1">
      {children}
    </div>
  );
};

const Header = () => {
  useRequiredContext(DirectoryContext);

  const rootName = useDirectory((c) => c.root.name);

  return (
    <div className="bg-border flex h-14 w-full items-center justify-between px-4">
      <span className="text-sm font-bold">📁 {rootName}</span>
      <div className="flex items-center gap-2">
        <CollapseButton />
        <ExpandButton />
      </div>
    </div>
  );
};

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border text-card-foreground rounded-xl",
        "rounded-t-none border-none bg-transparent",
        "my-1 overflow-x-auto bg-transparent px-6 py-5 text-xs",
      )}
    >
      {children}
    </div>
  );
};

const Folder = memo(
  ({ folder, path }: { folder: FolderType; path: Array<string> }) => {
    useRequiredContext(DirectoryContext);
    const openOrCloseFolder = useDirectory((c) => c.openOrCloseFolder);
    return (
      <div className="flex flex-col">
        <span
          className="cursor-pointer select-none"
          onClick={() =>
            openOrCloseFolder(
              path,
              folder.name,
              folder.isOpen ? "closed" : "open",
            )
          }
        >
          {folder.isOpen ? "📂" : "📁"} {folder.name}
        </span>
        {folder.isOpen && (
          <div className="border-border flex flex-col border-l-2 py-1 pl-4">
            {folder.contents.map((content) => {
              if ("contents" in content) {
                return (
                  <Folder
                    key={content.name}
                    folder={content}
                    path={path.concat([content.name])}
                  />
                );
              }
              return <FileItem key={content.name} file={content} path={path} />;
            })}
          </div>
        )}
      </div>
    );
  },
  (prev, next) => {
    return equal(prev.folder, next.folder) && equal(prev.path, next.path);
  },
);

const FileItem = memo(
  ({ file, path }: { file: FileType; path: Array<string> }) => {
    return (
      <Tooltip.Frame>
        <Tooltip.Trigger asChild>
          <span className="w-fit">
            {file.name}.{file.type}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">
          {`${path.join("/")}/${file.name}.${file.type}`}
        </Tooltip.Content>
      </Tooltip.Frame>
    );
  },
  (prev, next) => {
    return equal(prev.file, next.file) && equal(prev.path, next.path);
  },
);

const List = () => {
  useRequiredContext(DirectoryContext);
  const root = useDirectory((c) => c.root);
  return root.contents.map((content) => {
    if ("contents" in content) {
      return (
        <Folder
          key={content.name}
          folder={content}
          path={[root.name, content.name]}
        />
      );
    }
    return <FileItem key={content.name} file={content} path={[root.name]} />;
  });
};

const CollapseButton = () => {
  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button variant="ghost" size="icon">
          <ListChevronsDownUp className="h-4 w-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Close all folders</Tooltip.Content>
    </Tooltip.Frame>
  );
};

const ExpandButton = () => {
  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button variant="ghost" size="icon">
          <ListChevronsUpDown className="h-4 w-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Open all folders</Tooltip.Content>
    </Tooltip.Frame>
  );
};

export { type Extension, type FileType, type FolderType };
export { DirectoryContext, useDirectory, Provider };
export { Folder, FileItem, Header, Frame, Body, List };
