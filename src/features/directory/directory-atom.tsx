"use client";

import { memo } from "react";
import { cn } from "@/utils/style-utils";
import equal from "fast-deep-equal";
import {
  File,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ListChevronsDownUp,
  ListChevronsUpDown,
} from "lucide-react";
import { DirectoryContext, useDirectory } from "./directory-context";
import type { FileType, FolderType } from "./directory-types";
import { Button } from "@/atoms/button";
import * as Tooltip from "@/atoms/tooltip";
import { useRequiredContext } from "@/lib/context";

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
    <div className="dark:bg-border bg-input flex h-14 w-full items-center justify-between px-4">
      <div className="ml-1 flex items-center gap-1.5">
        <FolderIcon fill="white" className="h-4 w-4" />
        <span className="mb-0.5 font-bold">{rootName}</span>
      </div>
      <div className="flex items-center gap-2">
        <CloseAllButton />
        <OpenAllButton />
      </div>
    </div>
  );
};

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        "my-1 overflow-x-auto px-6 py-5",
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
        <div
          className="hover:text-primary cursor-pointer"
          onClick={() =>
            openOrCloseFolder(path, folder.isOpen ? "closed" : "open")
          }
        >
          <div className="flex items-center gap-1">
            {folder.isOpen ? (
              <FolderOpenIcon className="h-3 w-3" />
            ) : (
              <FolderIcon fill="white" className="h-3 w-3" />
            )}{" "}
            <span className="text-sm select-none">{folder.name}</span>
          </div>
        </div>
        {folder.isOpen && (
          <div className="border-border my-1 flex flex-col gap-1 border-l-2 py-1 pl-4">
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
          <div className="flex w-fit items-center gap-1">
            <File className="h-3 w-3" />
            <span className="text-sm select-none">
              {file.name}.{file.type}
            </span>
          </div>
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
        <Folder key={content.name} folder={content} path={[content.name]} />
      );
    }
    return <FileItem key={content.name} file={content} path={[root.name]} />;
  });
};

const CloseAllButton = () => {
  useRequiredContext(DirectoryContext);
  const closeAll = useDirectory((c) => c.closeAll);
  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button variant="ghost" size="icon" onClick={closeAll}>
          <ListChevronsDownUp className="h-4 w-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Close all folders</Tooltip.Content>
    </Tooltip.Frame>
  );
};

const OpenAllButton = () => {
  useRequiredContext(DirectoryContext);
  const openAll = useDirectory((c) => c.openAll);
  return (
    <Tooltip.Frame>
      <Tooltip.Trigger asChild>
        <Button variant="ghost" size="icon" onClick={openAll}>
          <ListChevronsUpDown className="h-4 w-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Open all folders</Tooltip.Content>
    </Tooltip.Frame>
  );
};

export { Folder, FileItem, Header, Frame, Body, List };
