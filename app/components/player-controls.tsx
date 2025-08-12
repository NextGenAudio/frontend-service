

import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";

interface Song {
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
}

interface PlayerControlsProps {
  song: Song;
}

export const PlayerControls = ({ song }: PlayerControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState([40]); // 40% progress

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="h-20 bg-player-background border-t border-border px-4 flex items-center gap-4">
      {/* Current Song Info */}
      <div className="flex items-center gap-3 min-w-0 w-1/4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="text-xs text-muted-foreground">Art</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{song.title}</div>
          <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-md mx-auto">
        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className={`h-8 w-8 hover:bg-hover-accent ${isShuffle ? 'text-primary' : ''}`}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-hover-accent">
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            className="h-10 w-10 bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg hover:shadow-glow transition-all"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-hover-accent">
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className={`h-8 w-8 hover:bg-hover-accent ${repeatMode > 0 ? 'text-primary' : ''}`}
            onClick={toggleRepeat}
          >
            <Repeat className="h-4 w-4" />
            {repeatMode === 2 && (
              <span className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center">
                1
              </span>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 text-xs text-muted-foreground">
          <span>{song.currentTime}</span>
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="flex-1"
          />
          <span>{song.duration}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-1/4 justify-end">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-hover-accent"
          onClick={toggleMute}
        >
          {isMuted || volume[0] === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <div className="w-24">
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};