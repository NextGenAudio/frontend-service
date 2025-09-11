import React, { createContext, useContext, useState } from "react";

const FileHandlingContext = createContext<FileHandlingContextType | null>(null);


type FileHandlingContextType = {
  songUploadRefresh: number;
  setSongUploadRefresh: React.Dispatch<React.SetStateAction<number>>;
  folderCreateRefresh: number;
  setFolderCreateRefresh: React.Dispatch<React.SetStateAction<number>>;
};


export const FileHandlingProvider = ({ children }: { children: React.ReactNode }) => {
  const [songUploadRefresh, setSongUploadRefresh] = useState(0);
  const [folderCreateRefresh, setFolderCreateRefresh] = useState(0);

  const value = {
    songUploadRefresh,
    setSongUploadRefresh,
    folderCreateRefresh,
    setFolderCreateRefresh,
  };

  return (
    <FileHandlingContext.Provider value={value}>
      {children}
    </FileHandlingContext.Provider>
  );
};

export function useFileHandling() {
  const context = useContext(FileHandlingContext);
  if (!context) {
    throw new Error("useFileHandling must be used within a FileHandlingProvider");
  }
  return context;
}
