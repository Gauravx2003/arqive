// context/FileContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/files.action";

type FileContextType = {
  files: Models.Document[];
  refreshFiles: () => Promise<void>;
  setFiles: React.Dispatch<React.SetStateAction<Models.Document[]>>;
};

const FileContext = createContext<FileContextType | null>(null);

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context)
    throw new Error("useFileContext must be used within FileProvider");
  return context;
};

export const FileProvider = ({
  children,
  initialFiles = [],
}: {
  children: React.ReactNode;
  initialFiles?: Models.Document[];
}) => {
  const [files, setFiles] = useState<Models.Document[]>(initialFiles);

  const refreshFiles = async () => {
    const result = await getFiles({ types: [], searchText: "", sort: "" });
    setFiles(result.documents);
  };

  return (
    <FileContext.Provider value={{ files, refreshFiles, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};
