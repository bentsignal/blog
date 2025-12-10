import type { FolderType } from "../types/directory-types";

const openOrCloseOneFolder = (
  directory: FolderType,
  path: Array<string>,
  newValue: "open" | "closed",
): FolderType => {
  if (path.length === 0) {
    return {
      ...directory,
      isOpen: newValue === "open" ? true : false,
    };
  }
  return {
    ...directory,
    contents: directory.contents.map((content) => {
      if ("contents" in content === false) {
        return content;
      }
      if (content.name === path[0]) {
        const [_currentSegment, ...remainingSegments] = path;
        return openOrCloseOneFolder(content, remainingSegments, newValue);
      }
      return content;
    }),
  };
};

const openAllFolders = (directory: FolderType): FolderType => ({
  ...directory,
  isOpen: true,
  contents: directory.contents.map((content) =>
    "contents" in content ? openAllFolders(content) : content,
  ),
});

const closeAllFolders = (directory: FolderType): FolderType => ({
  ...directory,
  isOpen: false,
  contents: directory.contents.map((content) =>
    "contents" in content ? closeAllFolders(content) : content,
  ),
});

export { openOrCloseOneFolder, openAllFolders, closeAllFolders };
