"use client";
import { createContext, useContext, useRef, ReactNode } from "react";

type AudioCtxContextType = {
  audioCtxRef: React.MutableRefObject<AudioContext | null>;
};

const AudioCtxContext = createContext<AudioCtxContextType | undefined>(
  undefined
);

export function AudioCtxProvider({ children }: { children: ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Lazy initialize AudioContext
  if (!audioCtxRef.current && typeof window !== "undefined") {
    const WebkitAudioCtor = (window as unknown as {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    const AudioCtor = (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext || WebkitAudioCtor;
    if (AudioCtor) {
      audioCtxRef.current = new AudioCtor();
    }
  }

  return (
    <AudioCtxContext.Provider value={{ audioCtxRef }}>
      {children}
    </AudioCtxContext.Provider>
  );
}

export function useAudioCtx() {
  const ctx = useContext(AudioCtxContext);
  if (!ctx) throw new Error("useAudioCtx must be used inside AudioCtxProvider");
  return ctx;
}
