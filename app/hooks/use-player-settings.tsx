import { useState, useEffect } from "react";
import { useSidebar } from "../utils/sidebar-context";

export const usePlayerSettings = () => {
  const { player } = useSidebar();

  // Initialize with localStorage values or defaults
  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 50;
    const saved = localStorage.getItem("volume");
    return saved !== null ? Number(saved) : 50;
  });

  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("isMuted");
    return saved !== null ? saved === "true" : false;
  });

  const [isRepeat, setIsRepeat] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("isRepeat");
    return saved !== null ? saved === "true" : false;
  });

  const [progress, setProgress] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("progress");
    return saved !== null ? Number(saved) : 0;
  });

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
