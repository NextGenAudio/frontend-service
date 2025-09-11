"use client";

import React, { useEffect, useRef, useState } from "react";
import Waviz from "waviz/core";

type Props = {
  fileName: string; // e.g. "mysong.mp3"
  source: string;
};

export default function CustomVisualizer({ source, fileName }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wavizRef = useRef<Waviz | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Waviz once
  useEffect(() => {
    if (canvasRef.current && audioRef.current) {
      wavizRef.current = new Waviz(canvasRef.current, audioRef.current);
    }
  }, []);

  // Handle Play
  const handlePlay = async () => {
    if (!audioRef.current || !wavizRef.current) return;

    await audioRef.current.play();
    setIsPlaying(true);

    // Waviz requires user gesture → initialize when playing
    await wavizRef.current.input.initializePending();
    wavizRef.current.visualizer?.bars([
      // Each bar config as an array, according to Waviz's expected type
      [0, 2, 0.5], // Example: [position, width, height] or similar, adjust as per Waviz docs
      // Add more arrays if needed for more bars
    ]);
  };

  // Handle Pause
  const handlePause = () => {
    if (!audioRef.current || !wavizRef.current) return;

    audioRef.current.pause();
    wavizRef.current.visualizer?.stop();
    setIsPlaying(false);
  };

  return (
    <div className="p-4 border-b border-white/10">
      <div className="relative h-40 rounded-xl bg-gradient-to-r from-orange-500/20 via-pink-500/30 to-red-500/20 overflow-hidden flex items-center justify-center">
        {/* Canvas where bars are drawn */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

        {/* Title */}
        <span className="z-10 text-sm text-white/70 font-medium">
          {fileName}
        </span>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          ▶ Play
        </button>
        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          ⏸ Pause
        </button>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={`/songs/${fileName}`}
        crossOrigin="anonymous"
      />
    </div>
  );
}
