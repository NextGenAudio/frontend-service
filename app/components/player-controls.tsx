"use client"

import { useState, useRef, useEffect } from "react"
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
  Mic2,
  Settings,
  Maximize2,
  Minimize2,
  BarChart3,
  Zap,
  Clock,
  List,
  Share,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Slider } from "@/app/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip"

interface Song {
  title: string
  artist: string
  album: string
  duration: string
  currentTime: string
  liked?: boolean
  albumArt?: string
}

interface PlayerControlsProps {
  song: Song
}

export const PlayerControls = ({ song }: PlayerControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: all, 2: one
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState([40])
  const [isLiked, setIsLiked] = useState(song.liked || false)
  const [showQueue, setShowQueue] = useState(false)
  const [crossfade, setCrossfade] = useState([3])
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [showEqualizer, setShowEqualizer] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showVisualizer, setShowVisualizer] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  const togglePlayPause = () => setIsPlaying(!isPlaying)
  const toggleShuffle = () => setIsShuffle(!isShuffle)
  const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3)
  const toggleMute = () => setIsMuted(!isMuted)
  const toggleLike = () => setIsLiked(!isLiked)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlayPause()
          break
        case "ArrowRight":
          if (e.shiftKey) {
            // Skip forward
            console.log("[v0] Skip forward")
          }
          break
        case "ArrowLeft":
          if (e.shiftKey) {
            // Skip backward
            console.log("[v0] Skip backward")
          }
          break
        case "KeyL":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleLike()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return (
    <TooltipProvider>
      <div className="relative h-36 bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-orange-500/20 backdrop-blur-xl border-t border-white/10 px-6 flex items-center gap-6 shadow-2xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-pink-400/10 animate-pulse" />

        {/* Current Song Info */}
        <div className="flex items-center gap-4 min-w-0 w-1/4 relative z-10">
          <div className="relative group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400/30 to-pink-400/30 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              {song.albumArt ? (
                <img
                  src={song.albumArt || "/placeholder.svg"}
                  alt="Album art"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-sm text-white/70 font-medium">♪</div>
              )}
            </div>
            {/* Visualizer overlay */}
            {showVisualizer && (
              <div className="absolute inset-0 flex items-end justify-center gap-0.5 p-2 rounded-xl">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-orange-400 to-pink-400 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white truncate text-lg">{song.title}</div>
            <div className="text-sm text-white/70 truncate">{song.artist}</div>
            <div className="text-xs text-white/50 truncate">{song.album}</div>
          </div>

          {/* Song actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    isLiked ? "text-red-400 bg-red-400/20" : "text-white/70 hover:text-red-400"
                  }`}
                  onClick={toggleLike}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? "Remove from liked" : "Add to liked"} (Ctrl+L)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:scale-110 hover:bg-white/20 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to playlist</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex-1 flex flex-col items-center gap-3 max-w-2xl mx-auto relative z-10">
          {/* Primary Control Buttons */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-10 w-10 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    isShuffle ? "text-orange-400 bg-orange-400/20" : "text-white/70 hover:text-white"
                  }`}
                  onClick={toggleShuffle}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shuffle {isShuffle ? "on" : "off"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:scale-110 hover:bg-white/20 transition-all duration-300"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous (Shift+←)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 hover:scale-110 border-2 border-white/20"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? "Pause" : "Play"} (Space)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:scale-110 hover:bg-white/20 transition-all duration-300"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next (Shift+→)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-10 w-10 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 relative ${
                    repeatMode > 0 ? "text-orange-400 bg-orange-400/20" : "text-white/70 hover:text-white"
                  }`}
                  onClick={toggleRepeat}
                >
                  <Repeat className="h-4 w-4" />
                  {repeatMode === 2 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-orange-400 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      1
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Repeat {repeatMode === 0 ? "off" : repeatMode === 1 ? "all" : "one"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-3 text-sm text-white/70">
            <span className="font-mono text-xs">{song.currentTime}</span>
            <div className="flex-1 relative group" ref={progressRef}>
              <Slider
                value={progress}
                onValueChange={setProgress}
                max={100}
                step={0.1}
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-400 [&_[role=slider]]:to-pink-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 hover:[&_[role=slider]]:scale-125"
              />
              {/* Progress bar glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-sm  duration-300" />
            </div>
            <span className="font-mono text-xs">{song.duration}</span>
          </div>

          {/* Secondary Controls */}
          {/* <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    showQueue ? "text-orange-400 bg-orange-400/20" : "text-white/50 hover:text-white/70"
                  }`}
                  onClick={() => setShowQueue(!showQueue)}
                >
                  <List className="h-4 w-4" />
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
                  className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    showLyrics ? "text-orange-400 bg-orange-400/20" : "text-white/50 hover:text-white/70"
                  }`}
                  onClick={() => setShowLyrics(!showLyrics)}
                >
                  <Mic2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lyrics</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    showVisualizer ? "text-orange-400 bg-orange-400/20" : "text-white/50 hover:text-white/70"
                  }`}
                  onClick={() => setShowVisualizer(!showVisualizer)}
                >
                  <BarChart3 className="h-4 w-4" />
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
                  className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    showEqualizer ? "text-orange-400 bg-orange-400/20" : "text-white/50 hover:text-white/70"
                  }`}
                  onClick={() => setShowEqualizer(!showEqualizer)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Equalizer</p>
              </TooltipContent>
            </Tooltip>
          </div> */}
        </div>

        {/* Advanced Controls & Volume */}
        <div className="flex items-center gap-4 w-1/4 justify-end relative z-10">
          {/* Playback Speed */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 text-white/50 hover:text-white/70 hover:scale-110 hover:bg-white/20 transition-all duration-300"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Playback speed: {playbackSpeed[0]}x</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-16 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Slider
                value={playbackSpeed}
                onValueChange={setPlaybackSpeed}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Crossfade */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 text-white/50 hover:text-white/70 hover:scale-110 hover:bg-white/20 transition-all duration-300"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crossfade: {crossfade[0]}s</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-16 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Slider value={crossfade} onValueChange={setCrossfade} max={12} step={1} className="w-full" />
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:scale-110 hover:bg-white/20 transition-all duration-300"
                  onClick={toggleMute}
                >
                  {isMuted || volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>

            <div className="w-28 group">
              <Slider
                value={isMuted ? [0] : volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-400 [&_[role=slider]]:to-pink-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 hover:[&_[role=slider]]:scale-125"
              />
              {/* Volume level indicator */}
              <div className="text-xs text-white/50 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isMuted ? 0 : volume[0]}%
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 text-white/50 hover:text-white/70 hover:scale-110 hover:bg-white/20 transition-all duration-300"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 ${
                    isMinimized ? "text-orange-400 bg-orange-400/20" : "text-white/50 hover:text-white/70"
                  }`}
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMinimized ? "Expand" : "Mini player"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
