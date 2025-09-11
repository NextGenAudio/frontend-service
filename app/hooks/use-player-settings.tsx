import { useState, useEffect } from "react";

export const usePlayerSettings = () => {
  const [volume, setVolume] = useState(50);     // default
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load saved settings once on client
  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ guard

    const savedVolume = localStorage.getItem("volume");
    const savedMuted = localStorage.getItem("isMuted");
    const savedRepeat = localStorage.getItem("isRepeat");
    const savedProgress = localStorage.getItem("progress");

    if (savedVolume !== null) setVolume(Number(savedVolume));
    if (savedMuted !== null) setIsMuted(savedMuted === "true");
    if (savedRepeat !== null) setIsRepeat(savedRepeat === "true");
    if (savedProgress !== null) setProgress(Number(savedProgress));
  }, []);

  // Save whenever values change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("volume", String(volume));
    }
  }, [volume]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isMuted", String(isMuted));
    }
  }, [isMuted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isRepeat", String(isRepeat));
    }
  }, [isRepeat]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("progress", String(progress));
    }
  }, [progress]);

  return {
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isRepeat,
    setIsRepeat,
    progress,
    setProgress,
  };
};
