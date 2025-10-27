"use client";
import { createContext, useContext, useRef, useEffect, ReactNode } from "react";

type AudioCtxContextType = {
  audioCtxRef: React.MutableRefObject<AudioContext | null>;
};

const AudioCtxContext = createContext<AudioCtxContextType | undefined>(undefined);

export function AudioCtxProvider({ children }: { children: ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize only once on client after mount
    if (!audioCtxRef.current) {
      const WebkitAudioCtor = (window as any).webkitAudioContext;
      const AudioCtor = window.AudioContext || WebkitAudioCtor;
      if (AudioCtor) {
        audioCtxRef.current = new AudioCtor();
      }
    }
  }, []);

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
