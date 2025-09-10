"use client";

import { useState, useContext, useEffect } from "react";
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
  const { selectSong, setSelectSong, playingSong, setPlayingSong } =
    useMusicContext();
  const { isPlaying, setIsPlaying } = useMusicContext();
  const {
    player,
    home,
    upload,
    profile,
    createFolder,
    playlist,
    detailPanel,
  } = useSidebar();
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

  return (
    <>
      <div className="bg-slate-900 h-screen ml-[115px] rounded-[32px] bg-background text-foreground flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] drop-shadow-xl">
        {/* Main Content Area - now takes full height since player is floating */}
        <div className="flex-1 min-h-0 h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Libraries Panel */}
            <ResizablePanel defaultSize={20} minSize={10} maxSize={25}>
              <LibraryPanel
                songRefresh={songUploadRefresh}
                folderRefresh={folderCreateRefresh}
              />
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Main Playlist Panel */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <ProfileDropdown />
              {createFolder && (
                <FolderCreate setRefresh={setFolderCreateRefresh} />
              )}
              {upload && <MusicUpload setRefresh={setSongUploadRefresh} />}
              {playlist && <PlaylistPanel />}
              {home && <MusicPlayerHome />}
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Song Details Panel */}
            <ResizablePanel
              defaultSize={0}
              minSize={20}
              maxSize={25}
              
            >
              {detailPanel && <SongDetailsPanel song={selectSong} />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {player && <FloatingPlayerControls song={playingSong} />}
    </>
  );
}
