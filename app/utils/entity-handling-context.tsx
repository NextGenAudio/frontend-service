import React, { createContext, useContext, useState } from "react";
import { useMusicContext } from "./music-context";

const EntityHandlingContext = createContext<EntityHandlingContextType | null>(null);

type EntityHandlingContextType = {
  songUploadRefresh: number;
  setSongUploadRefresh: React.Dispatch<React.SetStateAction<number>>;
  folderCreateRefresh: number;
  setFolderCreateRefresh: React.Dispatch<React.SetStateAction<number>>;
  playlistCreateRefresh: number;
  setPlaylistCreateRefresh: React.Dispatch<React.SetStateAction<number>>;
  songAddToPlaylistRefresh: number;
  setSongAddToPlaylistRefresh: React.Dispatch<React.SetStateAction<number>>;
};

export const EntityHandlingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [songUploadRefresh, setSongUploadRefresh] = useState(0);
  const [folderCreateRefresh, setFolderCreateRefresh] = useState(0);
  const [playlistCreateRefresh, setPlaylistCreateRefresh] = useState(0);
  const [songAddToPlaylistRefresh, setSongAddToPlaylistRefresh] = useState(0);
  const value = {
    songUploadRefresh,
    setSongUploadRefresh,
    folderCreateRefresh,
    setFolderCreateRefresh,
    playlistCreateRefresh,
    setPlaylistCreateRefresh,
    songAddToPlaylistRefresh,
    setSongAddToPlaylistRefresh,

  };

  return (
    <EntityHandlingContext.Provider value={value}>
      {children}
    </EntityHandlingContext.Provider>
  );
};

export function useFileHandling() {
  const context = useContext(EntityHandlingContext);
  if (!context) {
    throw new Error(
      "useFileHandling must be used within a FileHandlingProvider"
    );
  }
  return context;
}
