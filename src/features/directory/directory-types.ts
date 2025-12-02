type Extension = "ts" | "tsx";

type FileType = {
  name: string;
  type: Extension;
};

type FolderType = {
  name: string;
  isOpen?: boolean;
  contents: Array<FileType | FolderType>;
};

export type { Extension, FileType, FolderType };
