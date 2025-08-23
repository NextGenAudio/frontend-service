"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  MoreHorizontal,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import InfiniteScroll from "react-infinite-scroll-component";
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
    {
      id: "1",
      title: "Marathondi",
      artist: "JANANA, Shehara Alahakoon, Dilmi Gunarathe",
      album: "",
      duration: "3:45",
      currentTime: "1:23",
    },
    {
      id: "2",
      title: "Moonlit Dreams",
      artist: "Stellar Vibes",
      album: "Night Sky",
      duration: "3:45",
      currentTime: "0:00",
    },
    {
      id: "4",
      title: "Heartbeat",
      artist: "Pulse Makers",
      album: "Rhythm Core",
      duration: "3:35",
      currentTime: "0:00",
    },
    {
      id: "4",
      title: "Echoes of Time",
      artist: "Chrono Beats",
      album: "Timeless",
      duration: "3:30",
      currentTime: "0:00",
    },
    {
      id: "5",
      title: "Neon Pulse",
      artist: "Electro Wave",
      album: "City Lights",
      duration: "4:05",
      currentTime: "0:00",
    },
    {
      id: "6",
      title: "Silent Waves",
      artist: "Ocean Sound",
      album: "Deep Blue",
      duration: "3:15",
      currentTime: "0:00",
    },
    {
      id: "7",
      title: "Starbound",
      artist: "Cosmic Drift",
      album: "Galaxy Road",
      duration: "4:50",
      currentTime: "0:00",
    },
    {
      id: "8",
      title: "Fading Lights",
      artist: "Twilight Tunes",
      album: "Dusk",
      duration: "2:45",
      currentTime: "0:00",
    },
    {
      id: "9",
      title: "Rhythm of Rain",
      artist: "Stormy Notes",
      album: "Cloudburst",
      duration: "3:20",
      currentTime: "0:00",
    },
    {
      id: "10",
      title: "Golden Hour",
      artist: "Sunny Chords",
      album: "Sunset Vibes",
      duration: "4:00",
      currentTime: "0:00",
    },
    {
      id: "11",
      title: "Midnight Run",
      artist: "Night Runners",
      album: "After Dark",
      duration: "3:55",
      currentTime: "0:00",
    },
    {
      id: "12",
      title: "Urban Jungle",
      artist: "City Groove",
      album: "Concrete Beats",
      duration: "3:10",
      currentTime: "0:00",
    },
    {
      id: "13",
      title: "Lost in Time",
      artist: "Retro Souls",
      album: "Vintage Echoes",
      duration: "4:30",
      currentTime: "0:00",
    },
    {
      id: "14",
      title: "Skyward",
      artist: "Aerial Tones",
      album: "Horizon",
      duration: "3:40",
      currentTime: "0:00",
    },
    {
      id: "15",
      title: "Electric Dreams",
      artist: "Synth Masters",
      album: "Future Sound",
      duration: "4:15",
      currentTime: "0:00",
    },
    {
      id: "16",
      title: "Whispers of Dawn",
      artist: "Morning Mist",
      album: "First Light",
      duration: "3:25",
      currentTime: "0:00",
    },
    {
      id: "17",
      title: "Fire Within",
      artist: "Blaze Tunes",
      album: "Inferno",
      duration: "4:20",
      currentTime: "0:00",
    },
    {
      id: "18",
      title: "Drifting Clouds",
      artist: "Sky Serenade",
      album: "Atmosphere",
      duration: "3:50",
      currentTime: "0:00",
    },
  ];

  const [items, setItems] = useState(songs.slice(0, 5));
  const [hasMore, setHasMore] = useState(true);
  const handleSongClick = (song: Song) => {
    setCurrentSongId(song.id);
    onSongSelect(song);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  function fetchMoreData() {
    // Simulate fetching more songs (pagination)
    const nextItems = songs.slice(items.length, items.length + 10);
    setItems((prev) => [...prev, ...nextItems]);
    if (items.length + nextItems.length >= songs.length) {
      setHasMore(false);
    }
  }

  return (
    <div className=" h-full flex flex-col relative overflow-y-scroll py-20 pb-96">
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-slate-400/20 to-gray-800/20 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 cursor-pointer group transition-all duration-30  border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-52 h-52 rounded-xl overflow-hidden relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center"
                  alt="Playlist cover"
                  className="w-full h-full object-cover"
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVisualizer(!showVisualizer);
                    }}
                    className="h-8 px-14 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    title={
                      showVisualizer ? "Hide Visualizer" : "Show Visualizer"
                    }
                  >
                    <BarChart3
                      className={`h-4 w-4 transition-colors ${
                        showVisualizer ? "text-orange-300" : "text-white/70"
                      }`}
                    />
                    Visualizer
                  </Button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-[1px]" />
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-8xl  font-extrabold text-white drop-shadow-lg">
                  Playlist #1
                </h2>
                <p className="text-base text-white/80">{songs.length} songs</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVisualizer(!showVisualizer);
                }}
                className="h-8 px-14 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                title={showVisualizer ? "Hide Visualizer" : "Show Visualizer"}
              >
                <BarChart3
                  className={`h-4 w-4 transition-colors ${
                    showVisualizer ? "text-orange-300" : "text-white/70"
                  }`}
                />
                Visualizer
              </Button>
            </div>
          </div>
        </div>

        {/* Glass Visualizer Area */}
        {showVisualizer && (
          <div className="p-4 border-b border-white/10">
            <div className="h-32 bg-gradient-to-r from-orange-500/20 via-pink-500/30 to-red-500/20 rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="text-sm text-white/70 font-medium z-10">
                Music Visualizer
              </div>
              {/* Enhanced animated bars */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 px-8">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-orange-400/60 to-pink-400/80 rounded-full animate-pulse shadow-lg"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${Math.random() * 1 + 0.5}s`,
                    }}
                  />
                ))}
              </div>
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
            </div>
          </div>
        )}
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <ScrollArea>
            <div className="p-4 space-y-2">
              {songs.map((song, id) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border hover:scale-[1.01] hover:shadow-lg ${
                    currentSongId === song.id
                      ? "bg-gradient-to-r from-orange-500/30 to-pink-500/20 border-orange-400/40 shadow-lg shadow-orange-500/20"
                      : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                  }`}
                  onClick={() => handleSongClick(song)}
                >
                  <div className="font-medium truncate text-white drop-shadow-sm">
                      {id+1}
                    </div>
                  <div className="relative">
                     
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl bg-white/10 hover:bg-orange-500/30 border border-white/20 opacity-100 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                    > 
                      {isPlaying && currentSongId === song.id ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </div>

                  <div className="flex-1 min-w-0">
                   
                    <div className="font-medium truncate text-white drop-shadow-sm">
                      {song.title}
                    </div>
                    <div className="text-sm text-white/70 truncate">
                      {song.artist}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentSongId === song.id && isPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse rounded-full shadow-sm"></div>
                        <div className="w-1 h-2 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse delay-100 rounded-full shadow-sm"></div>
                        <div className="w-1 h-4 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse delay-200 rounded-full shadow-sm"></div>
                      </div>
                    )}
                    <span className="text-sm text-white/70 font-medium">
                      {song.duration}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-3 w-3 text-white/70" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </InfiniteScroll>
      </div>
    </div>
  );
};
