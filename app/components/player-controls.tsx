"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  Plus,
  Settings,
  BarChart3,
  List,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import Image from "next/image";

interface Song {
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
  liked?: boolean;
  albumArt?: string;
}

interface PlayerControlsProps {
  song: Song;
}

export const FloatingPlayerControls = ({ song }: PlayerControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState([40]);
  const [isLiked, setIsLiked] = useState(song.liked || false);
  const [showQueue, setShowQueue] = useState(false);
  const [crossfade, setCrossfade] = useState([3]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = () => setIsLiked(!isLiked);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            console.log("[v0] Skip forward");
          }
          break;
        case "ArrowLeft":
          if (e.shiftKey) {
            console.log("[v0] Skip backward");
          }
          break;
        case "KeyL":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleLike();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[85%] max-w-[1800px]">
        <div className="relative bg-gradient-to-r from-orange-900/90 via-slate-700/15 to-slate-900/90 backdrop-blur-xl border border-orange-300/50 rounded-3xl px-6 py-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] drop-shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/10 via-transparent to-orange-300/10 rounded-2xl animate-pulse" />

          <div className="relative z-10 space-y-4">
            {/* Top row: Song info, controls, and utilities */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 min-w-0 w-1/4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-orange-300/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-orange-300/30 transition-all duration-300 group-hover:scale-105">
                    <Image
                      src="/assets/marathondi-song.jpg"
                      alt="Album art"
                      width={68}
                      height={68}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* />
                    ) : (
                      <div className="text-sm text-orange-200/90 font-medium">♪</div>
                    )} */}
                  </div>

                  {showVisualizer && (
                    <div className="absolute inset-0 flex items-end justify-center gap-0.5 p-1.5 rounded-lg">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-gradient-to-t from-orange-400/80 to-orange-200/60 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 50 + 20}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white truncate text-sm">
                    {song.title}
                  </div>
                  <div className="text-xs text-orange-200/70 truncate">
                    {song.artist}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border border-orange-300/20 transition-all duration-300 hover:scale-110 hover:bg-orange-400/30 ${
                          isLiked
                            ? "text-red-400 bg-red-400/20"
                            : "text-orange-200/80 hover:text-red-400"
                        }`}
                        onClick={toggleLike}
                      >
                        <Heart
                          className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isLiked ? "Remove from liked" : "Add to liked"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-full backdrop-blur-sm border border-orange-300/20 text-orange-200/80 hover:text-white hover:scale-110 hover:bg-orange-400/30 transition-all duration-300"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to playlist</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 rounded-full backdrop-blur-sm border border-orange-300/20 transition-all duration-300 hover:scale-110 hover:bg-orange-400/30 ${
                          isShuffle
                            ? "text-white bg-orange-400/30"
                            : "text-orange-200/80 hover:text-white"
                        }`}
                        onClick={toggleShuffle}
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shuffle</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full backdrop-blur-sm border border-orange-300/20 text-orange-200/80 hover:text-white hover:scale-110 hover:bg-orange-400/30 transition-all duration-300"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Previous</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg hover:shadow-orange-400/50 transition-all duration-300 hover:scale-110 border border-orange-300/30"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isPlaying ? "Pause" : "Play"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full backdrop-blur-sm border border-orange-300/20 text-orange-200/80 hover:text-white hover:scale-110 hover:bg-orange-400/30 transition-all duration-300"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 rounded-full backdrop-blur-sm border border-orange-300/20 transition-all duration-300 hover:scale-110 hover:bg-orange-400/30 relative ${
                          repeatMode > 0
                            ? "text-white bg-orange-400/30"
                            : "text-orange-200/80 hover:text-white"
                        }`}
                        onClick={toggleRepeat}
                      >
                        <Repeat className="h-3.5 w-3.5" />
                        {repeatMode === 2 && (
                          <span className="absolute -top-1 -right-1 text-xs bg-orange-400 text-white rounded-full w-3 h-3 flex items-center justify-center font-bold">
                            1
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Repeat</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center gap-3 w-1/4 justify-end">
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border border-orange-300/20 transition-all duration-300 hover:scale-110 hover:bg-orange-400/30 ${
                          showQueue
                            ? "text-white bg-orange-400/30"
                            : "text-orange-200/70 hover:text-orange-100"
                        }`}
                        onClick={() => setShowQueue(!showQueue)}
                      >
                        <List className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Queue</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border border-orange-300/20 transition-all duration-300 hover:scale-110 hover:bg-orange-400/30 ${
                          showVisualizer
                            ? "text-white bg-orange-400/30"
                            : "text-orange-200/70 hover:text-orange-100"
                        }`}
                        onClick={() => setShowVisualizer(!showVisualizer)}
                      >
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visualizer</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border border-orange-300/20 transition-all duration-300 hover:scale-110 hover:bg-orange-400/30 ${
                          showEqualizer
                            ? "text-white bg-orange-400/30"
                            : "text-orange-200/70 hover:text-orange-100"
                        }`}
                        onClick={() => setShowEqualizer(!showEqualizer)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-full backdrop-blur-sm border border-orange-300/20 text-orange-200/80 hover:text-white hover:scale-110 hover:bg-orange-400/30 transition-all duration-300"
                        onClick={toggleMute}
                      >
                        {isMuted || volume[0] === 0 ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isMuted ? "Unmute" : "Mute"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="w-24 group">
                    <Slider
                      value={isMuted ? [0] : volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-400 [&_[role=slider]]:to-orange-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-300/30 [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 hover:[&_[role=slider]]:scale-125 [&_.slider-track]:bg-orange-300/30 [&_.slider-range]:bg-gradient-to-r [&_.slider-range]:from-orange-400 [&_.slider-range]:to-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-8">
              <span className="font-mono text-sm text-orange-200/80 whitespace-nowrap min-w-[3rem] text-right">
                {song.currentTime}
              </span>
              <div
                className="flex-1 max-w-2xl relative group"
                ref={progressRef}
              >
                <Slider
                  value={progress}
                  onValueChange={setProgress}
                  max={100}
                  step={0.1}
                  className=""
                />
                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-mono text-sm text-orange-200/80 whitespace-nowrap min-w-[3rem]">
                {song.duration}
              </span>
           
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
