"use client";

import { useState } from "react";
import { useMusicContext, Song } from "../utils/music-context";
import { useSidebar } from "../utils/sidebar-context";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import {
  Play,
  Pause,
  X,
  Clock,
  Shuffle,
  Music,
  ListMusic,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { metadata } from "../layout";

export function QueuePanel() {
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const { setQueue } = useSidebar();
  const {
    songQueue,
    setSongQueue,
    playingSong,
    isPlaying,
    setIsPlaying,
    setSelectSong,
    setSelectSongId,
    setPlayingSong,
    setPlayingSongId,
    shuffleQueue,
  } = useMusicContext();

  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  const handleSongClick = (song: Song) => {
    setSelectSongId(song.id);
    setSelectSong(song);
    setPlayingSong(song);
    setPlayingSongId(song.id);
    setIsPlaying(true);
  };

  const handleRemoveFromQueue = (songId: string) => {
    const updatedQueue = songQueue.filter((song) => song.id !== songId);
    setSongQueue(updatedQueue);
  };

  const clearQueue = () => {
    setSongQueue([]);
  };

  const handleShuffleQueue = () => {
    const currentPlayingIndex = songQueue.findIndex(
      (song) => song.id === playingSong?.id
    );

    if (currentPlayingIndex === -1) return;

    // Keep currently playing song at the start, shuffle the rest
    const currentSong = songQueue[currentPlayingIndex];
    const remainingSongs = songQueue.filter(
      (song) => song.id !== playingSong?.id
    );

    // Shuffle algorithm
    for (let i = remainingSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingSongs[i], remainingSongs[j]] = [
        remainingSongs[j],
        remainingSongs[i],
      ];
    }
    setSongQueue([currentSong, ...remainingSongs]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTotalDuration = () => {
    return songQueue.reduce((total, song) => {
      return total + (parseFloat(song.metadata?.track_length) || 0);
    }, 0);
  };

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-xl border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 cursor-pointer group transition-all duration-300">
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-3 border py-2 border-white/20 shadow-lg">
          <ListMusic className={`w-6 h-6 ${themeColors.text}`} />
          <h2 className="text-lg font-semibold text-white/90 flex items-center">
            Queue
            <span className="text-2xl text-white/60 font-normal ml-2">|</span>
            <span className="text-sm text-white/60 font-normal ml-2">
              {songQueue.length} songs
            </span>
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setQueue(false)}
            className="h-8 w-8 rounded-xl bg-white/10 hover:bg-red-500/20 border border-white/20 text-white/70 hover:text-red-400 transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Queue Stats */}
        <div className="flex items-center justify-between text-sm text-white/70 mt-4">
          {/* <span>{songQueue.length} songs</span> */}
          {/* Queue Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffleQueue}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${
                shuffleQueue ? theme.preview : "bg-white/10"
              } text-white text-xs font-medium hover:scale-105 transition-transform shadow-lg`}
            >
              <Shuffle className="w-3 h-3" />
              Shuffle
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(getTotalDuration())}</span>
          </div>
        </div>
      </div>

      <Separator className="mx-4 bg-white/10" />

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto">
        {songQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Music className="w-12 h-12 text-white/30 mb-4" />
            <h3 className="text-white/50 font-medium mb-2">
              Your queue is empty
            </h3>
            <p className="text-white/30 text-sm">
              Add songs to your queue to see them here
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {/* Table Header */}
            {/* <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-white/60 border-b border-white/10 mb-2">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2 text-right">Duration</div>
            </div> */}

            {/* Song Rows */}
            {songQueue.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className={`group grid grid-cols-12 gap-3 items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm border hover:shadow-lg ${
                  playingSong?.id === song.id
                    ? `bg-gradient-to-r ${theme.preview} border-white/40 shadow-lg ${themeColors.shadow}`
                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                }`}
                onClick={() => handleSongClick(song)}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
              >
                {/* Queue Number / Play Button */}
                <div className="col-span-1 flex items-center justify-center">
                  {playingSong?.id === song.id ? (
                    <div
                      className="w-4 h-4 text-white flex items-center justify-center"
                      style={{ color: theme.primary }}
                    >
                      {isPlaying ? (
                        <div className="flex space-x-0.5">
                          <div className="w-0.5 h-3 bg-current animate-pulse"></div>
                          <div className="w-0.5 h-3 bg-current animate-pulse delay-75"></div>
                          <div className="w-0.5 h-3 bg-current animate-pulse delay-150"></div>
                        </div>
                      ) : (
                        <Play className="w-3 h-3" fill="currentColor" />
                      )}
                    </div>
                  ) : hoveredSong === song.id ? (
                    <Play className="w-3 h-3 text-white" />
                  ) : (
                    <span className="text-sm text-white/70">{index + 1}</span>
                  )}
                </div>

                {/* Title Column */}
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={
                        song.musicArt ||
                        song.metadata?.cover_art ||
                        "/placeholder.svg"
                      }
                      alt={song.title || song.filename}
                      className="w-10 h-10 rounded-md object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm truncate ${
                        playingSong?.id === song.id
                          ? "font-semibold text-white"
                          : "font-medium text-white"
                      }`}
                      style={
                        playingSong?.id === song.id
                          ? { color: theme.primary }
                          : {}
                      }
                    >
                      {song.title || song.filename}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        playingSong?.id === song.id
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    >
                      {song.artist || "Unknown Artist"}
                    </div>
                  </div>
                </div>

                {/* Album Column */}
                <div className="col-span-3 min-w-0">
                  <div className="text-sm text-white/70 truncate">
                    {song.album || song.metadata?.album || "Unknown Album"}
                  </div>
                </div>

                {/* Duration Column */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <div className="text-sm text-white/70">
                    {song?.metadata?.track_length
                      ? formatDuration(song.metadata.track_length)
                      : "0:00"}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromQueue(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all"
                  >
                    <X className="w-3 h-3 text-white/50" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
