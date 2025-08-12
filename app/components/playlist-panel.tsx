"use client"

import { useState } from "react";
import { Play, Pause, MoreHorizontal, ChevronDown, BarChart3 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
}

interface PlaylistPanelProps {
  onSongSelect: (song: Song) => void;
}

export const PlaylistPanel = ({ onSongSelect }: PlaylistPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSongId, setCurrentSongId] = useState("1");
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  const songs = [
    { id: "1", title: "song #1", artist: "Artist Name", album: "Album Name", duration: "3:45", currentTime: "1:23" },
    { id: "2", title: "song #2", artist: "Another Artist", album: "Album Name", duration: "4:12", currentTime: "0:00" },
    { id: "3", title: "song #3", artist: "Third Artist", album: "Album Name", duration: "2:58", currentTime: "0:00" },
    { id: "4", title: "song #4", artist: "Fourth Artist", album: "Album Name", duration: "5:23", currentTime: "0:00" },
  ];

  const handleSongClick = (song: Song) => {
    setCurrentSongId(song.id);
    onSongSelect(song);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 border-b border-border cursor-pointer hover:bg-hover-accent transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center"
                    alt="Playlist cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-xl font-bold">Playlist #1</h2>
                  <p className="text-sm text-muted-foreground">{songs.length} songs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVisualizer(!showVisualizer);
                  }}
                  className="h-8 w-8 hover:bg-hover-accent"
                  title={showVisualizer ? "Hide Visualizer" : "Show Visualizer"}
                >
                  <BarChart3 className={`h-4 w-4 ${showVisualizer ? 'text-primary' : 'text-muted-foreground'}`} />
                </Button>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="flex-1 overflow-auto">
          {/* Audio Visualizer Area */}
          {showVisualizer && (
            <div className="p-4 border-b border-border">
              <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-sm text-muted-foreground">Music Visualizer</div>
                {/* Animated bars for visual effect */}
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary/40 rounded-full animate-pulse"
                      style={{
                        // height: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${Math.random() * 1 + 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-hover-accent cursor-pointer transition-colors group ${
                  currentSongId === song.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'
                }`}
                onClick={() => handleSongClick(song)}
              >
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                  >
                    {isPlaying && currentSongId === song.id ? 
                      <Pause className="h-4 w-4" /> : 
                      <Play className="h-4 w-4" />
                    }
                  </Button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  {currentSongId === song.id && isPlaying && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-primary animate-pulse"></div>
                      <div className="w-1 h-2 bg-primary animate-pulse delay-100"></div>
                      <div className="w-1 h-4 bg-primary animate-pulse delay-200"></div>
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">{song.duration}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-hover-accent">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};