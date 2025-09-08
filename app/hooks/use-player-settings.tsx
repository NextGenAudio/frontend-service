import { useState, useEffect } from "react";

export const usePlayerSettings = () => {
  // Load from localStorage (or defaults if none)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved ? Number(saved) : 50; // default 50%
  });

  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("isMuted");
    return saved === "true"; // default false
  });

  const [isRepeat, setIsRepeat] = useState(() => {
    const saved = localStorage.getItem("isRepeat");
    return saved === "true"; // default false
  });

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("progress");
    return saved ? Number(saved) : 0; // default 0s
  });

  // Save whenever volume changes
  useEffect(() => {
    localStorage.setItem("volume", String(volume));
  }, [volume]);

  // Save whenever mute changes
  useEffect(() => {
    localStorage.setItem("isMuted", String(isMuted));
  }, [isMuted]);

  // Save whenever repeat changes
  useEffect(() => {
    localStorage.setItem("isRepeat", String(isRepeat));
  }, [isRepeat]);

  // Save whenever progress changes
  useEffect(() => {
    localStorage.setItem("progress", String(progress));
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
