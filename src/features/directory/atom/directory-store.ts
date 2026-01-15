"use client";

import { useState } from "react";
import { createStore } from "rostra";
import {
  closeAllFolders,
  openAllFolders,
  openOrCloseOneFolder,
} from "../utils";
import type { FolderType } from "../types";

function useInternalStore({ initialRoot }: { initialRoot: FolderType }) {
  const [root, setRoot] = useState(initialRoot);

  function openOrCloseFolder(path: Array<string>, newValue: "open" | "closed") {
    setRoot((prevRoot) => {
      const pathWithoutRoot = path.slice(1);
      return openOrCloseOneFolder(prevRoot, pathWithoutRoot, newValue);
    });
  }

  function openAll() {
    setRoot((prevRoot) => {
      return openAllFolders(prevRoot);
    });
  }

  function closeAll() {
    setRoot((prevRoot) => {
      return closeAllFolders(prevRoot);
    });
  }

  return { root, openOrCloseFolder, openAll, closeAll };
}

export const { Store, useStore } = createStore(useInternalStore);
