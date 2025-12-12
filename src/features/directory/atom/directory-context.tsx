"use client";

import { useCallback, useState } from "react";
import {
  closeAllFolders,
  openAllFolders,
  openOrCloseOneFolder,
} from "../utils";
import type { FolderType } from "../types";
import { createContext } from "@/lib/context";

const { Context, useContext } = createContext<{
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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Context, useContext, Provider };
