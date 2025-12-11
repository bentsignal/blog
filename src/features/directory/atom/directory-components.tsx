"use client";

import { memo } from "react";
import { getLanguage } from "@/features/code/languages/utils";
import equal from "fast-deep-equal";
import {
  File as DefaultFileIcon,
  ExternalLink,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ListChevronsDownUp,
  ListChevronsUpDown,
} from "lucide-react";
import type { FileExtension, FileType, FolderType } from "../types";
import {
  Context as DirectoryContext,
  useContext as useDirectory,
} from "./directory-context";
import { Button } from "@/atoms/button";
import * as Tooltip from "@/atoms/tooltip";
import { useRequiredContext } from "@/lib/context";

const FolderIdentifier = () => {
  useRequiredContext(DirectoryContext);

  const rootName = useDirectory((c) => c.root.name);

  return (
    <div className="ml-1 flex items-center gap-1.5">
      <FolderIcon fill="white" className="h-3 w-3" />
      <span className="text-muted-foreground mb-0.5 text-sm font-semibold">
        {rootName}
      </span>
    </div>
  );
};

const Folder = memo(
  ({ folder, path }: { folder: FolderType; path: Array<string> }) => {
    useRequiredContext(DirectoryContext);
    const openOrCloseFolder = useDirectory((c) => c.openOrCloseFolder);
    return (
      <div className="flex flex-col">
        <button
          className="hover:text-primary cursor-pointer"
          onClick={() =>
            openOrCloseFolder(path, folder.isOpen ? "closed" : "open")
          }
        >
          <div className="flex items-center gap-1.5">
            {folder.isOpen ? (
              <FolderOpenIcon className="h-3 w-3" />
            ) : (
              <FolderIcon fill="white" className="h-3 w-3" />
            )}{" "}
            <span className="text-sm select-none">{folder.name}</span>
          </div>
        </button>
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
          <div className="flex w-fit items-center gap-1.5">
            <FileIcon extension={file.extension} />
            <span className="text-sm select-none">
              {file.name}.{file.extension}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" className="flex items-center gap-1">
          <span>{`${path.join("/")}/${file.name}.${file.extension}`}</span>
          {file.link && (
            // eslint-disable-next-line next/no-html-link-for-pages
            <a href={file.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </Tooltip.Content>
      </Tooltip.Frame>
    );
  },
  (prev, next) => {
    return equal(prev.file, next.file) && equal(prev.path, next.path);
  },
);

const FileIcon = ({ extension }: { extension: FileExtension }) => {
  const language = getLanguage(extension);
  if (!language) return <DefaultFileIcon className="h-3 w-3" />;
  const { icon: Icon } = language;
  return Icon ? (
    <Icon className="h-3 w-3" />
  ) : (
    <DefaultFileIcon className="h-3 w-3" />
  );
};

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

export {
  Folder,
  FileItem,
  FolderIdentifier,
  List,
  CloseAllButton,
  OpenAllButton,
};
