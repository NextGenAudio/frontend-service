"use client";
import React from 'react'

import { createContext, useState, useContext } from "react";
interface Song {
  id: string;
  title: string | undefined;
  filename: string;
  artist: string | undefined;
  album: string | undefined;
  path: string;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  isLiked: boolean;
}

type MusicContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  songList: Song[];
  entityName: string | null;
  entityArt: string | null;
  entityType: "folder" | "playlist" | null;
  setSongList: (value: Song[]) => void;
  setEntityName: (value: string | null) => void;
  setEntityArt: (value: string | null) => void;
  setEntityType: (value: "folder" | "playlist" | null) => void;
  setCurrentSong: (value: Song | null) => void;
  setIsPlaying: (value: boolean) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);
  const [entityName, setEntityName] = useState<string | null>(null);
  const [entityArt, setEntityArt] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"folder" | "playlist" | null>(null);
  const value = {
    currentSong,
    isPlaying,
    songList,
    entityName,
    entityArt,
    entityType,
    setSongList,
    setEntityName,
    setEntityArt,
    setEntityType,
    setCurrentSong,
    setIsPlaying,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
}

export default MusicContext;
