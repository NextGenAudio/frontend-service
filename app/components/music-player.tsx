"use client";

import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/app/components/ui/resizable";
import { LibrariesPanel } from "./libraries-panel";
import { PlaylistPanel } from "./playlist-panel";
import { SongDetailsPanel } from "./song-details-panel";
import { PlayerControls } from "./player-controls";
import { TopBar } from "./topbar";

export const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState({
    title: "song #1",
    artist: "nowplayingsong",
    album: "Playlist #1",
    duration: "3:45",
    currentTime: "1:23"
  });

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar with Polygon Header */}
      <TopBar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Libraries Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <LibrariesPanel />
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
          
          {/* Main Playlist Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <PlaylistPanel onSongSelect={setCurrentSong} />
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
          
          {/* Song Details Panel */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <SongDetailsPanel song={currentSong} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Bottom Player Controls */}
      <PlayerControls song={currentSong} />
    </div>
  );
};