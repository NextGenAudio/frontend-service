"use client";
import { useState, useEffect } from "react";
import { useSidebar } from "../utils/sidebar-context";

export const usePlayerSettings = () => {
  const [isClient, setIsClient] = useState(false);

  // Stable defaults
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ Mark when client-side rendering begins
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Load from localStorage only after hydration
  useEffect(() => {
    if (!isClient) return;

    const storedVolume = localStorage.getItem("volume");
    const storedMuted = localStorage.getItem("isMuted");
    const storedRepeat = localStorage.getItem("isRepeat");
    const storedProgress = localStorage.getItem("progress");

    if (storedVolume !== null) setVolume(Number(storedVolume));
    if (storedMuted !== null) setIsMuted(storedMuted === "true");
    if (storedRepeat !== null) setIsRepeat(storedRepeat === "true");
    if (storedProgress !== null) setProgress(Number(storedProgress));
  }, [isClient]);

  // ✅ Save changes
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("volume", String(volume));
  }, [volume, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("isMuted", String(isMuted));
  }, [isMuted, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("isRepeat", String(isRepeat));
  }, [isRepeat, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("progress", String(progress));
  }, [progress, isClient]);

  return {
    isClient,
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
