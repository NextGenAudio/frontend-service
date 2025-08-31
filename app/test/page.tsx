"use client";
import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { parseWebStream } from "music-metadata";

const MyAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  const soundRef = useRef<Howl | null>(null);
  const src = "songs\\Ahinsakawi - Dimanka Wellalage - www.artmusic.lk.mp3"; // ✅ rename to avoid spaces

  useEffect(() => {
    // Create Howler sound
    const sound = new Howl({
      src: [src],
      html5: true,
      volume: 0.7,
      preload: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
    });

    soundRef.current = sound;

    // Load metadata with music-metadata-browser
    (async () => {
      const response = await fetch(src);
      const blob = await response.blob();
      const data = await parseWebStream(blob.stream());

      setMetadata(data.common);
      setDuration(sound.duration()); // Howler duration
    })();

    // Progress updater
    const interval = setInterval(() => {
      if (sound.playing()) {
        setProgress(sound.seek() as number);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      sound.unload();
    };
  }, [src]);

  // Play / Pause
  const togglePlay = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  // Mute
  const toggleMute = () => {
    const sound = soundRef.current;
    if (!sound) return;

    sound.mute(!muted);
    setMuted(!muted);
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sound = soundRef.current;
    if (!sound) return;

    const value = parseFloat(e.target.value);
    sound.seek(value);
    setProgress(value);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-2xl shadow-lg space-y-4">
      {/* Metadata */}
      {metadata && (
        <div className="text-center">
          {metadata.picture?.[0] && (
            <img
              src={`data:${metadata.picture[0].format};base64,${Buffer.from(
                metadata.picture[0].data
              ).toString("base64")}`}
              alt="Album cover"
              className="w-32 h-32 mx-auto rounded-lg object-cover mb-2"
            />
          )}
          <h2 className="text-lg font-bold">{metadata.title || "Unknown Title"}</h2>
          <p className="text-sm text-gray-400">
            {metadata.artist || "Unknown Artist"}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500"
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>

        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600"
        >
          {muted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">{progress.toFixed(0)}s</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={handleSeek}
          className="flex-1"
        />
        <span className="text-sm">{duration.toFixed(0)}s</span>
      </div>
    </div>
  );
};

export default MyAudioPlayer;
