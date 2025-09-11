"use client";

import { useState, useContext, useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/ui/resizable";
import { LibraryPanel } from "@/app/components/library-panel";
import { PlaylistPanel } from "@/app/components/playlist-panel";
import { SongDetailsPanel } from "@/app/components/song-details-panel";
import { FloatingPlayerControls } from "@/app/components/player-controls";
import { ScrollArea } from "@radix-ui/themes";
import { parseWebStream } from "music-metadata";
import { useSidebar } from "../utils/sidebar-context";
import { MusicUpload } from "./music-upload";
import { FolderCreate } from "./folder-create";
import { MusicProvider, useMusicContext } from "../utils/music-context";
import { create } from "domain";
import { ProfileDropdown } from "./profile-dropdown";
import { MusicPlayerHome } from "./music-player-home";
import AudioVisualizer from "./audio-visualizer";
import { usePlayerSettings } from "../hooks/use-player-settings";
import { Howl } from "howler";

interface Song {
  id: string;
  title: string | undefined;
  filename: string;

  artist: string | undefined;
  album: string | undefined;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  isLiked: boolean;
}

export function MusicPlayer() {
  const [metadata, setMetadata] = useState<any>(null);
  const {
    setIsPlaying,
    selectSong,
    setSelectSong,
    playingSong,
    setPlayingSong,
    soundRef,
    currentTime,
    setPlayingSongDuration,
    repeatMode,
    analyserRef,
    dataArrayRef,
  } = useMusicContext();
  const { volume, setVolume, isMuted, setIsMuted, isRepeat, setIsRepeat } =
    usePlayerSettings();
  const { player, home, upload, profile, createFolder, playlist, detailPanel, visualizer} =
    useSidebar();
  const [songUploadRefresh, setSongUploadRefresh] = useState(0);
  const [folderCreateRefresh, setFolderCreateRefresh] = useState(0);

  const handleUploadSuccess = () => {
    setSongUploadRefresh((old) => old + 1); // increment key
  };
  const handleCreateFolderSuccess = () => {
    setFolderCreateRefresh((old) => old + 1); // increment key
  };

  useEffect(() => {
    if (!selectSong) return;

    const url = `http://localhost:8080/files/download/${selectSong.filename}`;
    console.log("Song URL:", url);

    // Update state with direct backend URL
    setPlayingSong({
      ...selectSong,
      source: url,
      id: selectSong.id,
    });

    // Cleanup object URL if you used Blob before
    return () => {
      if (playingSong?.source?.startsWith("blob:")) {
        URL.revokeObjectURL(playingSong.source);
      }
    };
  }, [playingSong?.filename]);

  useEffect(() => {
    if (!playingSong?.source) return;

    // If already loaded with same source, don't recreate
    if (
      soundRef.current &&
      (soundRef.current as any)._src === playingSong.source
    ) {
      return;
    }

    // Stop and unload if switching to a different song
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    const sound = new Howl({
      src: [playingSong.source],
      html5: true,
      volume: isMuted ? 0 : volume / 100,
      preload: true,
      loop: repeatMode === 1,
      onplay: () => {
        setIsPlaying(true);
        setPlayingSongDuration(sound.duration() || 0);
      },
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
    });
    (sound as any)._sounds[0]._node.crossOrigin = "use-credentials";

    soundRef.current = sound;

    return () => {
      // only cleanup if unmounting, not when replaying same song
      sound.unload();
    };
  }, [playingSong?.source]);

  return (
    <>
      <div className="bg-slate-900 h-screen ml-[115px] rounded-[32px] bg-background text-foreground flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] drop-shadow-xl">
        {/* Main Content Area - now takes full height since player is floating */}
        <div className="flex-1 min-h-0 h-full">
          {/* <audio ref={audioRef} hidden playsInline /> */}
          <ResizablePanelGroup direction="horizontal" className="h-full">
        
            <ResizablePanel defaultSize={20} minSize={10} maxSize={25}>
              <div className="relative z-10 h-full">
              <LibraryPanel
                songRefresh={songUploadRefresh}
                folderRefresh={folderCreateRefresh}
              />
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Main Playlist Panel */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <ResizablePanelGroup direction="vertical">

                {visualizer && <ResizablePanel className="flex items-center justify-end p-4" defaultSize={15} minSize={15}>
                  {/* <ProfileDropdown /> */}
                 {visualizer && <AudioVisualizer />}
                </ResizablePanel>}

                <ResizablePanel defaultSize={85} minSize={88}>
                  {createFolder && (
                    <FolderCreate setRefresh={setFolderCreateRefresh} />
                  )}
                  {upload && <MusicUpload setRefresh={setSongUploadRefresh} />}
                  {playlist && <PlaylistPanel />}
                  {home && <MusicPlayerHome />}
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Song Details Panel */}

            {detailPanel && (
              <ResizablePanel defaultSize={22} minSize={20} maxSize={25}>
                {detailPanel && <SongDetailsPanel song={selectSong} />}
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>
      </div>

      {player && <FloatingPlayerControls song={playingSong} />}
    </>
  );
}
