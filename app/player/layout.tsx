"use client";

import { Sidebar } from "../components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/ui/resizable";
import { LibraryPanel } from "../components/library-panel";
import { useState, useEffect } from "react";
import { FloatingPlayerControls } from "../components/player-controls";
import { useSidebar } from "../utils/sidebar-context";
import { useMusicContext } from "../utils/music-context";
import { usePlayerSettings } from "../hooks/use-player-settings";
import { SongDetailsPanel } from "../components/song-details-panel";
import { FileHandlingProvider } from "../utils/file-handling-context";
import { Howl } from "howler";
import AudioVisualizer from "../components/audio-visualizer";
import { ProfileDropdown } from "../components/profile-dropdown";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const {
    player,
    home,
    upload,
    profile,
    createFolder,
    playlist,
    detailPanel,
    visualizer,
  } = useSidebar();
  const {
    setIsPlaying,
    selectSong,
    isPlaying,
    playingSong,
    setPlayingSong,
    soundRef,
    currentTime,
    setPlayingSongDuration,
    repeatMode,
    analyserRef,
    dataArrayRef,
    songList,
    setSelectSong,
    setSelectSongId,
    setPlayingSongId,
    playingSongId,
  } = useMusicContext();
  const { volume, setVolume, isMuted, setIsMuted, isRepeat, setIsRepeat } =
    usePlayerSettings();
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
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
  function handleSongDoubleClick(song: any) {
    setPlayingSongId(song.id);
    setSelectSongId(song.id);
    setSelectSong(song);
    setPlayingSong(song);
  }
  const handleNextClick = () => {
    const currentIndex = songList.findIndex((s) => s.id === playingSong?.id);
    const nextIndex = (currentIndex + 1) % songList.length;
    const nextSong = songList[nextIndex];
    handleSongDoubleClick(nextSong);
    setIsPlaying(true);
  };
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
      onload: () => {
        // Auto-play when the song is loaded and isPlaying is true
        setPlayingSongDuration(sound.duration() || 0);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        handleNextClick(); // 🎵 Automatically move to next song
      },
    });
    (sound as any)._sounds[0]._node.crossOrigin = "use-credentials";

    soundRef.current = sound;

    return () => {
      // only cleanup if unmounting, not when replaying same song
      sound.unload();
    };
  }, [playingSong?.source]);

  // Handle play/pause state changes
  useEffect(() => {
    if (!soundRef.current) return;

    if (isPlaying) {
      if (!soundRef.current.playing()) {
        soundRef.current.play();
      }
    } else {
      if (soundRef.current.playing()) {
        soundRef.current.pause();
      }
    }
  }, [isPlaying, soundRef.current]);

  return (
    <div className="relative h-screen overflow-hidden ">
      <div className="absolute top-0 left-0 h-screen rounded-[32px] w-screen bg-gradient-to-bl from-orange-400 via-orange-700 to-red-700 z-0"></div>
      {/* Sidebar with higher z-index */}

      <FileHandlingProvider>
        <div className="absolute top-0 left-0 z-10">
          <Sidebar />
        </div>
        {profile && <ProfileDropdown />}
        <div className="bg-slate-900 h-screen ml-[115px] rounded-[32px] bg-background text-foreground flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] drop-shadow-xl">
          <div className="flex-1 min-h-0 h-full">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={20} minSize={10} maxSize={25}>
                <div className="relative z-10 h-full">
                  <LibraryPanel />
                </div>
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={70}>
                {/* Music player positioned to not overlap sidebar */}

                <ResizablePanelGroup direction="vertical">
                  {visualizer && (
                    <ResizablePanel
                      className="flex items-center justify-end p-4"
                      defaultSize={15}
                      minSize={15}
                    >
                      {/* <ProfileDropdown /> */}
                      {visualizer && <AudioVisualizer />}
                    </ResizablePanel>
                  )}

                  <ResizablePanel defaultSize={85} minSize={88}>
                    <div className="h-full z-0">{children}</div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
              {detailPanel && (
                <ResizablePanel defaultSize={22} minSize={20} maxSize={25}>
                  {detailPanel && <SongDetailsPanel song={selectSong} />}
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </div>

          {player && <FloatingPlayerControls song={playingSong} />}
        </div>
      </FileHandlingProvider>
    </div>
  );
};

export default Home;
