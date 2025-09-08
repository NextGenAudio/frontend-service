"use client";
import React from 'react'

import { createContext, useState, useContext } from "react";
interface Song {
  id: string;
  title: string | undefined;
  filename: string;

  artist: string | undefined;
  album: string | undefined;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  // isLiked: boolean;
}



type MusicContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  setCurrentSong: (value: Song | null) => void;
  setIsPlaying: (value: boolean) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const value = {
    currentSong,
    isPlaying,
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
