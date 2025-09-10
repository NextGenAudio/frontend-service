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
  isPlaying: boolean;
  songList: Song[];
  entityName: string | null;
  entityArt: string | null;
  entityType: "folder" | "playlist" | null;
  setSongList: (value: Song[]) => void;
  setEntityName: (value: string | null) => void;
  setEntityArt: (value: string | null) => void;
  setEntityType: (value: "folder" | "playlist" | null) => void;
  setIsPlaying: (value: boolean) => void;
  duration: number;
  setDuration: (value: number) => void;
  selectSong: Song | null;
  playingSong: Song | null;
  setSelectSong: (value: Song | null) => void;
  setPlayingSong: (value: Song | null) => void;
  folderList: any[];
  playlistList: any[];
  setFolderList: (value: any[]) => void;
  setPlaylistList: (value: any[]) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [selectSong, setSelectSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);
  const [entityName, setEntityName] = useState<string | null>(null);
  const [entityArt, setEntityArt] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"folder" | "playlist" | null>(null);
  const [duration, setDuration] = useState(0);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [folderList, setFolderList] = useState<any[]>([]);
  const [playlistList, setPlaylistList] = useState<any[]>([]);

  const value = {
    selectSong,
    playingSong,
    isPlaying,
    songList,
    entityName,
    entityArt,
    entityType,
    duration,
    folderList,
    playlistList,
    setFolderList,
    setPlaylistList,
    setPlayingSong,
    setDuration,
    setSongList,
    setEntityName,
    setEntityArt,
    setEntityType,
     setSelectSong,
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
