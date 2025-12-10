"use client";

import { useCallback, useState } from "react";
import type { FolderType } from "../types/directory-types";
import {
  closeAllFolders,
  openAllFolders,
  openOrCloseOneFolder,
} from "../utils/directory-utils";
import { createContext } from "@/lib/context";

const { Context: DirectoryContext, useContext: useDirectory } = createContext<{
  root: FolderType;
  openOrCloseFolder: (path: Array<string>, newValue: "open" | "closed") => void;
  openAll: () => void;
  closeAll: () => void;
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
    (path: Array<string>, newValue: "open" | "closed") => {
      setRoot((prevRoot) => {
        const pathWithoutRoot = path.slice(1);
        return openOrCloseOneFolder(prevRoot, pathWithoutRoot, newValue);
      });
    },
    [],
  );

  const openAll = useCallback(() => {
    setRoot((prevRoot) => {
      return openAllFolders(prevRoot);
    });
  }, []);

  const closeAll = useCallback(() => {
    setRoot((prevRoot) => {
      return closeAllFolders(prevRoot);
    });
  }, []);

  const contextValue = { root, openOrCloseFolder, openAll, closeAll };

  return (
    <DirectoryContext.Provider value={contextValue}>
      {children}
    </DirectoryContext.Provider>
  );
};

export { DirectoryContext, useDirectory, Provider };
