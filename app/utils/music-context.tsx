"use client";
import React, { useRef } from "react";

import { createContext, useState, useContext } from "react";

export interface Mood{
  id: number;
  mood: string;
  description: string;
}

export interface Genre{
  id: number;
  genre: string;
  description: string;
}
export interface Song {
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
  liked: boolean;
  genre?: string;
  mood: Mood;
}

type MusicContextType = {
  isPlaying: boolean;
  songList: Song[];

  setSongList: (value: Song[]) => void;

  setIsPlaying: (value: boolean) => void;
  duration: number;
  setDuration: (value: number) => void;
  selectSong: Song | null;
  playingSong: Song | null;
  setSelectSong: (value: Song | null) => void;
  setPlayingSong: (value: Song | null) => void;
  playingSongDuration: number;
  setPlayingSongDuration: (value: number) => void;
  soundRef: React.MutableRefObject<Howl | null>;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  dataArrayRef: React.MutableRefObject<Uint8Array | null>;
  currentTime: number;
  setCurrentTime: (value: number) => void;
  repeatMode: number;
  setRepeatMode: (value: number) => void;
  selectSongId: string | null;
  playingSongId: string | null;
  setSelectSongId: (value: string | null) => void;
  setPlayingSongId: (value: string | null) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [selectSong, setSelectSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);

  const [duration, setDuration] = useState(0);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);

  const [playingSongDuration, setPlayingSongDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectSongId, setSelectSongId] = useState<string | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const value = {
    selectSong,
    playingSong,
    isPlaying,
    songList,
    duration,
    setPlayingSong,
    setDuration,
    setSongList,
    setSelectSong,
    setIsPlaying,
    playingSongDuration,
    setPlayingSongDuration,
    soundRef,
    currentTime,
    setCurrentTime,
    repeatMode,
    setRepeatMode,
    analyserRef,
    dataArrayRef,
    selectSongId,
    playingSongId,
    setSelectSongId,
    setPlayingSongId,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
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
