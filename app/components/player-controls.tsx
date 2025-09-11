"use client";

import { useState, useRef, useEffect, use } from "react";
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
import { Howl } from "howler";
import { parseWebStream } from "music-metadata";
import SongCover from "./song-cover";
import * as RadixSlider from "@radix-ui/react-slider";
import { usePlayerSettings } from "@/app/hooks/use-player-settings";
import MusicContext, { useMusicContext } from "../utils/music-context";

interface Song {
  id: string;
  title: string | undefined;
  filename: string;
  artist: string | undefined;
  album: string | undefined;
  // duration: string;
  source: string;
  metadata: any;
  isLiked: boolean;
}

export const FloatingPlayerControls = ({ song }: { song: Song | null }) => {
  const [isShuffle, setIsShuffle] = useState(false);
 

  // const [progress, setProgress] = useState(0);

  const [metadata, setMetadata] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [crossfade, setCrossfade] = useState([3]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0); // in percentage 0-100
  const [isDragging, setIsDragging] = useState(false);

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setRepeatMode(((repeatMode + 1) % 3));
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = () => setIsLiked(!isLiked);

  const { volume, setVolume, isMuted, setIsMuted, isRepeat, setIsRepeat } =
    usePlayerSettings();
  const { isPlaying, setIsPlaying, currentTime, setCurrentTime , soundRef , playingSongDuration, setPlayingSongDuration , repeatMode, setRepeatMode } = useMusicContext();
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          setIsPlaying(!isPlaying);
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
        case "KeyM":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleMute();
          }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // useEffect(() => {
  //   if (!song?.source) return;

  //   // If already loaded with same source, don't recreate
  //   if (soundRef.current && (soundRef.current as any)._src === song.source) {
  //     return;
  //   }

  //   // Stop and unload if switching to a different song
  //   if (soundRef.current) {
  //     soundRef.current.stop();
  //     soundRef.current.unload();
  //   }

  //   const sound = new Howl({
  //     src: [song.source],
  //     html5: true,
  //     volume: isMuted ? 0 : volume / 100,
  //     preload: true,
  //     loop: repeatMode === 1,
  //     onplay: () => {
  //       setIsPlaying(true);
  //       setPlayingSongDuration(sound.duration() || 0);
  //     },
  //     onpause: () => setIsPlaying(false),
  //     onend: () => setIsPlaying(false),
  //   });

  //   soundRef.current = sound;

  //   return () => {
  //     // only cleanup if unmounting, not when replaying same song
  //     sound.unload();
  //   };
  // }, [song?.source]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (soundRef.current && isPlaying) {
      interval = setInterval(() => {
        const seek = soundRef.current?.seek() as number;
        setCurrentTime(seek);
        setProgress((seek / playingSongDuration) * 100 || 0);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isPlaying, playingSongDuration]);

  // 2. Update volume while playing
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume / 100);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.loop(repeatMode === 1);
    }
  }, [repeatMode]);

  const handleSeek = (value: number[]) => {
    if (!soundRef.current) return;
    const percent = value[0];
    const seekTime = (percent / 100) * playingSongDuration;
    soundRef.current.seek(seekTime);
    setProgress(percent); // percent
    setCurrentTime(seekTime); // seconds
  };

  useEffect(() => {
    let frame: number;
    const update = () => {
      if (soundRef.current && soundRef.current.playing() && !isDragging) {
        const time = soundRef.current.seek() as number;
        setCurrentTime(time);
        setProgress((time / playingSongDuration) * 100);
      }
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [playingSongDuration, isDragging]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    if (isPlaying) {
      if (!sound.playing()) {
        sound.play();
      }
    } else {
      if (sound.playing()) {
        sound.pause();
      }
    }
  }, [isPlaying]);

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
                  <div className="overflow-hidden w-16 h-16 bg-orange-300/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-orange-300/30 transition-all duration-300 group-hover:scale-105">
                    <SongCover song={song} />
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
                    {song?.title}
                  </div>
                  <div className="text-xs text-orange-200/70 truncate">
                    {song?.artist}
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
                        onClick={() => setIsPlaying(!isPlaying)}
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
                        {isMuted || volume === 0 ? (
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

                  <div className="w-40 group">
                    <RadixSlider.Root
                      value={isMuted ? [0] : [volume]}
                      onValueChange={([value]) => setVolume(value)}
                      max={100}
                      step={1}
                      className="w-full relative flex items-center select-none touch-none h-5 cursor-pointer"
                    >
                      {/* Track (background line) */}
                      <RadixSlider.Track className="bg-orange-300/30 relative grow rounded-full h-3">
                        {/* Filled portion */}
                        <RadixSlider.Range className="absolute bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full" />
                      </RadixSlider.Track>

                      {/* Thumb (knob) */}
                      {/* <RadixSlider.Thumb className="block w-3 h-5 rounded-full bg-white shadow-lg hover:scale-110 transition-transform" /> */}
                    </RadixSlider.Root>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-8">
              <span className="font-mono text-sm text-orange-200/80 whitespace-nowrap min-w-[3rem] text-right">
                {`${Math.floor(currentTime / 60)}:${(currentTime % 60)
                  .toFixed(0)
                  .padStart(2, "0")}`}
              </span>
              <div className="flex-1 max-w-2xl relative group">
                <RadixSlider.Root
                  value={[progress]}
                  onValueChange={([val]) => {
                    setIsDragging(true); // user is dragging
                    setProgress(val); // update UI
                  }}
                  onValueCommit={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full relative flex items-center select-none touch-none h-5 cursor-pointer"
                >
                  <RadixSlider.Track className="bg-orange-300/30 relative grow rounded-full h-3">
                    <RadixSlider.Range className="absolute bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full" />
                  </RadixSlider.Track>
                  {/* <RadixSlider.Thumb className="hidden group-hover:block w-5 h-5 rounded-full bg-orange-500 shadow-lg " /> */}
                </RadixSlider.Root>

                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <span className="font-mono text-sm text-orange-200/80 whitespace-nowrap min-w-[3rem]">
                {`${Math.floor(playingSongDuration / 60)}:${(playingSongDuration % 60)
                  .toFixed(0)
                  .padStart(2, "0")}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
