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

  // Save whenever volume changes
  useEffect(() => {
    localStorage.setItem("volume", String(volume));
  }, [volume]);

  // Save whenever mute changes
  useEffect(() => {
    localStorage.setItem("isMuted", String(isMuted));
  }, [isMuted]);

  return { volume, setVolume, isMuted, setIsMuted };
};
