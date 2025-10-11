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
import { getControlThemeColors } from "@/app/lib/theme-colors";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import Image from "next/image";
import { parseWebStream } from "music-metadata";
import SongCover from "./song-cover";
import * as RadixSlider from "@radix-ui/react-slider";
import { usePlayerSettings } from "@/app/hooks/use-player-settings";
import MusicContext, { useMusicContext } from "../utils/music-context";
import { useFileHandling } from "../utils/entity-handling-context";
import { useTheme } from "../utils/theme-context";
import { PlaylistSelectionDropdown } from "./playlist-selection-dropdown";
import { Song } from "../utils/music-context";
import axios from "axios";
import { metadata } from "../layout";

const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;
const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;

export const FloatingPlayerControls = ({
  song,
  handleNextClick,
}: {
  song: Song | null;
  handleNextClick: (playedSong: Song) => void;
}) => {
  const [isShuffle, setIsShuffle] = useState(false);

  // const [progress, setProgress] = useState(0);

  const [showQueue, setShowQueue] = useState(false);
  const [crossfade, setCrossfade] = useState([3]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0); // in percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const [liked, setliked] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setRepeatMode((repeatMode + 1) % 3);
  const toggleMute = () => setIsMuted(!isMuted);

  const { volume, setVolume, isMuted, setIsMuted, isRepeat, setIsRepeat } =
    usePlayerSettings();
  const {
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    soundRef,
    playingSongDuration,
    setPlayingSongDuration,
    repeatMode,
    setRepeatMode,
    songList,
    playingSong,
    songQueue,
    setSongQueue,
    setShuffleQueue,
  } = useMusicContext();
  const { setSelectSong, setPlayingSong, setSelectSongId, setPlayingSongId } =
    useMusicContext();

  const { theme } = useTheme();

  // Get theme-specific hover colors
  const themeColors = getControlThemeColors(theme.primary);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (song) {
      setliked(song.liked ? true : false);
    }
  }, [song]);

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

  const handleLikeClick = async () => {
    const newLikeStatus = !liked; // Calculate the new status first
    setliked(newLikeStatus);
    song!.liked = newLikeStatus;

    try {
      const response = await fetch(
        `${MUSIC_LIBRARY_SERVICE_URL}/files/${
          song!.id
        }/like?like=${newLikeStatus}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      console.log(response);
      if (!response.ok) {
        // ❌ Backend failed → rollback
        setliked(!newLikeStatus);
        song!.liked = !newLikeStatus;
        console.error("Failed to update like status on server");
        return; // Don't update score if like failed
      } else {
        console.log("Like status updated successfully");
      }
    } catch (err) {
      console.error("Failed to update like:", err);
      // Rollback on error
      setliked(!newLikeStatus);
      song!.liked = !newLikeStatus;
      return; // Don't update score if like failed
    }

    // Update music score based on like status (only if like was successful)
    let newScore = 0;
    if (newLikeStatus) {
      newScore = (song?.xscore ?? 0) + 2;
    } else {
      newScore = (song?.xscore ?? 0) - 2;
    }

    try {
      const response = await fetch(
        `${MUSIC_LIBRARY_SERVICE_URL}/files/${
          song!.id
        }/score?score=${newScore}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      console.log(response);
      if (!response.ok) {
        console.error("Failed to update music score on server");
      } else {
        console.log("Music score updated successfully");
        // Update local score only if API call was successful
        if (song) {
          song.xscore = newScore;
        }
      }
    } catch (err) {
      console.error("Failed to update music score:", err);
    }
  };

  function handleSongDoubleClick(song: Song) {
    setPlayingSongId(song.id);
    setSelectSongId(song.id);
    setSelectSong(song);
    setPlayingSong(song);
  }

  const handlePreviousClick = () => {
    const currentIndex = songQueue.findIndex((s) => s.id === playingSong?.id);
    const previousIndex =
      (currentIndex - 1 + songQueue.length) % songQueue.length;
    const previousSong = songQueue[previousIndex];
    handleSongDoubleClick(previousSong);
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    if (!song) return;

    try {
      const response = await axios.post(
        `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/${playlistId}/tracks`,
        { fileIds: [song.id] },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(`Song added to playlist: ${playlistId}`);
        // Optional: Show success notification
      } else {
        console.error("Failed to add song to playlist");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const handleCreateNewPlaylist = () => {
    // Navigate to create playlist page or open modal
    console.log("Create new playlist functionality");
  };
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[85%] max-w-[1800px]">
        <div className="relative backdrop-blur-xl border bg-gradient-to-t from-black/30 to-transparent border-white/50 rounded-3xl px-6 py-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] drop-shadow-2xl">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-300/10 via-transparent to-orange-300/10 rounded-2xl animate-pulse" /> */}

          <div className="relative z-10 space-y-4">
            {/* Top row: Song info, controls, and utilities */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 min-w-0 w-1/4">
                <div className="relative group">
                  <div
                    className={`overflow-hidden w-16 h-16 ${themeColors.hoverBg} backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-orange-300/30 transition-all duration-300 group-hover:scale-105`}
                  >
                    <SongCover song={song} />
                    {/* />
                    ) : (
                      <div className="text-sm text-orange-200/90 font-medium">♪</div>
                    )} */}
                  </div>
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
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110  ${
                          liked
                            ? "text-red-400 bg-red-400/20"
                            : "text-orange-200/80 hover:text-red-400"
                        }`}
                        onClick={handleLikeClick}
                      >
                        <Heart
                          className={`h-3 w-3 ${liked ? "fill-current" : ""}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{liked ? "Remove from liked" : "Add to liked"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-7 w-7 rounded-full backdrop-blur-sm border border-white/20 text-orange-200/80 ${themeColors.hover} transition-all duration-300 hover:scale-110`}
                          onClick={() =>
                            setShowPlaylistDropdown(!showPlaylistDropdown)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {showPlaylistDropdown && song && (
                          <PlaylistSelectionDropdown
                            songId={song.id}
                            onAddToPlaylist={handleAddToPlaylist}
                            onCreateNewPlaylist={handleCreateNewPlaylist}
                            onClose={() => setShowPlaylistDropdown(false)}
                          />
                        )}
                      </div>
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
                        className={`h-8 w-8 rounded-full backdrop-blur-sm border ${
                          themeColors.border
                        } transition-all duration-300 hover:scale-110 ${
                          themeColors.hoverBg
                        } ${
                          isShuffle
                            ? `text-white ${themeColors.activeBg}`
                            : "text-orange-200/80 hover:text-white"
                        }`}
                        onClick={() => {
                          toggleShuffle();
                          setShuffleQueue(!isShuffle);
                          setIsShuffle(!isShuffle);
                        }}
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
                        className={`h-8 w-8 rounded-full backdrop-blur-sm border ${themeColors.border} text-orange-200/80 hover:text-white hover:scale-110 ${themeColors.hoverBg} transition-all duration-300`}
                        onClick={handlePreviousClick}
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
                        className={`h-12 w-12 rounded-full bg-gradient-to-r ${theme.preview} ${themeColors.hoverFrom} ${themeColors.hoverTo} text-white shadow-lg ${themeColors.shadow} transition-all duration-300 border ${themeColors.border}`}
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
                        className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/20 text-orange-200/80 hover:text-white hover:scale-110 ${themeColors.hoverBg} transition-all duration-300`}
                        onClick={() => handleNextClick(playingSong!)}
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
                        className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 ${
                          themeColors.hoverBg
                        } relative ${
                          repeatMode > 0
                            ? "text-white bg-white/30"
                            : "text-orange-200/80 hover:text-white"
                        }`}
                        onClick={toggleRepeat}
                      >
                        <Repeat className="h-3.5 w-3.5" />
                        {repeatMode === 2 && (
                          <span
                            className={`absolute -top-1 -right-1 text-xs bg-gradient-to-r ${theme.preview} text-white rounded-full w-3 h-3 flex items-center justify-center font-bold`}
                          >
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
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border ${
                          themeColors.border
                        } transition-all duration-300 hover:scale-110 ${
                          themeColors.hoverBg
                        } ${
                          showQueue
                            ? `text-white ${themeColors.activeBg}`
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

                  {/* <Tooltip>
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
                  </Tooltip> */}
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-7 w-7 rounded-full backdrop-blur-sm border ${themeColors.border} text-orange-200/80 hover:text-white hover:scale-110 ${themeColors.hoverBg} transition-all duration-300`}
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
                      <RadixSlider.Track className="bg-white/20 relative grow rounded-full h-3">
                        {/* Filled portion */}
                        <RadixSlider.Range
                          className={`absolute ${themeColors.solidBg} h-full rounded-full`}
                        />
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
                  onValueCommit={([val]) => {
                    handleSeek([val]);
                    setIsDragging(false); // stop dragging
                  }}
                  max={100}
                  step={0.1}
                  className="w-full relative flex items-center select-none touch-none h-5 cursor-pointer"
                >
                  <RadixSlider.Track className="bg-white/20 relative grow rounded-full h-3">
                    <RadixSlider.Range
                      className={`absolute ${themeColors.solidBg} h-full rounded-full`}
                    />
                  </RadixSlider.Track>
                  {/* <RadixSlider.Thumb className="hidden group-hover:block w-5 h-5 rounded-full bg-orange-500 shadow-lg " /> */}
                </RadixSlider.Root>
              </div>
              <span className="font-mono text-sm text-orange-200/80 whitespace-nowrap min-w-[3rem]">
                {playingSongDuration > 0
                  ? `${Math.floor(playingSongDuration / 60)}:${(
                      playingSongDuration % 60
                    )
                      .toFixed(0)
                      .padStart(2, "0")}`
                  : "0:00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
