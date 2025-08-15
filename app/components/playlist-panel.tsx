"use client"

import { useState } from "react"
import { Play, Pause, MoreHorizontal, ChevronDown, BarChart3 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  currentTime: string
}

interface PlaylistPanelProps {
  onSongSelect: (song: Song) => void
}

export const PlaylistPanel = ({ onSongSelect }: PlaylistPanelProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSongId, setCurrentSongId] = useState("1")
  const [showVisualizer, setShowVisualizer] = useState(true)

  const songs = [
    { id: "1", title: "song #1", artist: "Artist Name", album: "Album Name", duration: "3:45", currentTime: "1:23" },
    { id: "2", title: "song #2", artist: "Another Artist", album: "Album Name", duration: "4:12", currentTime: "0:00" },
    { id: "3", title: "song #3", artist: "Third Artist", album: "Album Name", duration: "2:58", currentTime: "0:00" },
    { id: "4", title: "song #4", artist: "Fourth Artist", album: "Album Name", duration: "5:23", currentTime: "0:00" },
  ]

  const handleSongClick = (song: Song) => {
    setCurrentSongId(song.id)
    onSongSelect(song)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-400/15 to-red-400/20 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      <div className="relative z-10 h-full flex flex-col">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className="p-4 cursor-pointer group transition-all duration-300 hover:bg-white/10 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center"
                      alt="Playlist cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl" />
                  </div>
                  <div className="hidden sm:block">
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">Playlist #1</h2>
                    <p className="text-sm text-white/70">{songs.length} songs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowVisualizer(!showVisualizer)
                    }}
                    className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    title={showVisualizer ? "Hide Visualizer" : "Show Visualizer"}
                  >
                    <BarChart3
                      className={`h-4 w-4 transition-colors ${showVisualizer ? "text-orange-300" : "text-white/70"}`}
                    />
                  </Button>
                  <ChevronDown
                    className={`h-4 w-4 text-white/70 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="flex-1 overflow-auto">
            {/* Glass Visualizer Area */}
            {showVisualizer && (
              <div className="p-4 border-b border-white/10">
                <div className="h-32 bg-gradient-to-r from-orange-500/20 via-pink-500/30 to-red-500/20 rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-white/20">
                  <div className="text-sm text-white/70 font-medium z-10">Music Visualizer</div>
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

            <div className="p-4 space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border hover:scale-[1.02] hover:shadow-lg ${
                    currentSongId === song.id
                      ? "bg-gradient-to-r from-orange-500/30 to-pink-500/20 border-orange-400/40 shadow-lg shadow-orange-500/20"
                      : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                  }`}
                  onClick={() => handleSongClick(song)}
                >
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl bg-white/10 hover:bg-orange-500/30 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePlayPause()
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
                    <div className="font-medium truncate text-white drop-shadow-sm">{song.title}</div>
                    <div className="text-sm text-white/70 truncate">{song.artist}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentSongId === song.id && isPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse rounded-full shadow-sm"></div>
                        <div className="w-1 h-2 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse delay-100 rounded-full shadow-sm"></div>
                        <div className="w-1 h-4 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse delay-200 rounded-full shadow-sm"></div>
                      </div>
                    )}
                    <span className="text-sm text-white/70 font-medium">{song.duration}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-3 w-3 text-white/70" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
