// PlayerContext.tsx
import React, { createContext, useContext, useRef, useState } from "react";
import { Howl } from "howler";

type PlayerContextType = {
  soundRef: React.MutableRefObject<Howl | null>;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  duration: number;
  setDuration: (val: number) => void;
  currentTime: number;
  setCurrentTime: (val: number) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundRef = useRef<Howl | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <PlayerContext.Provider
      value={{ soundRef, isPlaying, setIsPlaying, duration, setDuration, currentTime, setCurrentTime }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
};
