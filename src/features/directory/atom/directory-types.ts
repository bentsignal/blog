type FileExtension = "ts" | "tsx";

type FileType = {
  name: string;
  extension: FileExtension;
  link?: string;
};

type FolderType = {
  name: string;
  isOpen?: boolean;
  contents: Array<FileType | FolderType>;
};

export type { FileExtension, FileType, FolderType };
