"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/app/components/ui/resizable"
import { LibraryPanel } from "@/app/components/library-panel"
import { PlaylistPanel } from "@/app/components/playlist-panel"
import { SongDetailsPanel } from "@/app/components/song-details-panel"
import { FloatingPlayerControls } from "@/app/components/player-controls"

export function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState({
    title: "song #1",
    artist: "nowplayingsong",
    album: "Playlist #1",
    duration: "3:45",
    currentTime: "1:23",
  })

  return (
    <>
      <div className="bg-slate-800 h-screen ml-[115px] rounded-[32px] bg-background text-foreground flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] drop-shadow-xl">
        {/* Main Content Area - now takes full height since player is floating */}
        <div className="flex-1 min-h-0 h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Libraries Panel */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
              <LibraryPanel />
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Main Playlist Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <PlaylistPanel onSongSelect={setCurrentSong} />
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Song Details Panel */}
            <ResizablePanel defaultSize={25} minSize={10} maxSize={30}>
              <SongDetailsPanel song={currentSong} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <FloatingPlayerControls song={currentSong} />
    </>
  )
}
