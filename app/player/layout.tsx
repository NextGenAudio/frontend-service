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
import { Song, useMusicContext } from "../utils/music-context";
import { usePlayerSettings } from "../hooks/use-player-settings";
import { SongDetailsPanel } from "../components/song-details-panel";
import { EntityHandlingProvider } from "../utils/entity-handling-context";
import { Howl } from "howler";
import AudioVisualizer from "../components/audio-visualizer";
import { ProfileDropdown } from "../components/profile-dropdown";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "../utils/theme-context";
import axios from "axios";

const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

const Home = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { theme, setTheme } = useTheme();
  const { player, home, upload, profile, detailPanel, visualizer } =
    useSidebar();
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
    songQueue,
    setSongQueue,
  } = useMusicContext();
  const { volume, setVolume, isMuted, setIsMuted, isRepeat, setIsRepeat } =
    usePlayerSettings();
  const { status } = useSession();
  const router = useRouter();

  // Add state to track if we're using recommendations
  const [usingRecommendations, setUsingRecommendations] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Remove this from the selectSong useEffect and create a separate one
  useEffect(() => {
    if (!playingSong || !songList.length) return;

    const currentIndex = songList.findIndex((s) => s.id === playingSong.id);
    console.log(
      "Queue reset useEffect triggered. Using recommendations:",
      usingRecommendations,
      "Queue length:",
      songQueue.length
    );

    // Don't reset queue if we're using recommendations
    if (usingRecommendations) {
      console.log("Skipping queue reset - using recommendations");
      return;
    }

    if (currentIndex !== -1 && songQueue.length <= 1) {
      // Get all songs from current index to end of list
      const queueFromCurrent = songList.slice(currentIndex);
      setSongQueue(queueFromCurrent);
      setUsingRecommendations(false);
      console.log(
        `Set queue from songList: ${queueFromCurrent.length} songs from index ${currentIndex}`
      );
    } else if (currentIndex === -1 && songQueue.length === 0) {
      // If current song not found in list AND queue is empty, set queue to just the current song
      setSongQueue([playingSong]);
      setUsingRecommendations(false);
      console.log(
        "Current song not in songList and queue empty, queue set to current song only"
      );
    } else {
      console.log("Keeping existing queue intact");
    }
  }, [playingSong?.id, songList]); // Dependencies: when song or list changes

  useEffect(() => {
    if (!selectSong) return;

    const url = `${MUSIC_LIBRARY_SERVICE_URL}/files/download/${selectSong.filename}`;
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
    console.log("Song Queue", songQueue);
    // if (!auto) {
    //   // Update music score
    //   const newScore = (song?.x_score ?? 0) + 1;
    //   fetch(`${NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL}/files/${song.id}/score?score=${newScore}`, {
    //     method: "POST",
    //     credentials: "include",
    //   }).catch((err) => console.error("Failed to update song score", err));
    // }
  }

  const handleNextClick = () => {
    const newQueue = [...songQueue]; // ✅ Declare as const inside the function
    newQueue.shift();
    setSongQueue(newQueue);

    console.log("Song Queue after shift (newQueue)", newQueue);
    if (!newQueue.length || !playingSong) return;
    const currentIndex = newQueue.findIndex((s) => s.id === playingSong?.id);

    if (newQueue.length < 2) {
      axios
        .get(
          `${MUSIC_LIBRARY_SERVICE_URL}/files/recommendations?genre=${playingSong?.genre?.genre},mood=${playingSong?.mood?.mood},artist=${playingSong?.artist}`,
          { withCredentials: true }
        )
        .then((response) => {
          const recommended = response.data as Song[];
          console.log("Fetched Recommended Songs:", recommended);

          // Remove duplicates - check against the newQueue that was captured in closure
          const uniqueRecommended = recommended.filter(
            (rec) => !newQueue.some((queued) => queued.id === rec.id)
          );

          console.log(
            "Unique Recommended Songs after filtering:",
            uniqueRecommended
          );

          const updatedQueue = [...newQueue, ...uniqueRecommended];
          setSongQueue(updatedQueue);
          setUsingRecommendations(true); // ✅ Set flag to prevent queue reset

          console.log("Final Updated Song Queue:", updatedQueue);

          // If we need to play the next song immediately after getting recommendations
          if (updatedQueue.length > 0) {
            const nextSong = updatedQueue[0]; // Play first song from updated queue
            console.log(
              "Playing next song from updated queue:",
              nextSong?.title
            );
            handleSongDoubleClick(nextSong);
            setIsPlaying(true);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch recommendations:", error);
        });
      return; // ✅ Important: return here to avoid playing song twice
    }

    // Only execute this if we didn't fetch recommendations
    const nextIndex = (currentIndex + 1) % newQueue.length;
    const nextSong = newQueue[nextIndex];
    console.log("Playing next song from existing queue:", nextSong?.title);
    handleSongDoubleClick(nextSong);
    setIsPlaying(true);
  };

  // Update listen count and last listened timestamp
  const updateListenedSong = (listenedSong: Song) => {
    listenedSong.lastListenedAt = new Date(); // Update local object

    listenedSong.listenCount = (listenedSong.listenCount || 0) + 1;
    axios
      .post(
        `${MUSIC_LIBRARY_SERVICE_URL}/files/${listenedSong.id}/listen_count?count=${listenedSong.listenCount}`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Listen timestamp updated:", response.data);
      })
      .catch((err) => {
        console.error("Failed to update listen timestamp", err);
      });

    console.log("Updated listen count:", listenedSong.listenCount);
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
        setPlayingSongDuration(
          parseFloat(playingSong.metadata?.track_length) || 0
        );
        // If isPlaying was set to true before the song loaded, start playing now
        if (isPlaying && soundRef.current && !soundRef.current.playing()) {
          soundRef.current.play();
        }
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => setIsPlaying(false),
      onend: () => {
        const listenedSong = playingSong;
        setIsPlaying(false);
        handleNextClick(); // Automatically move to next song
        updateListenedSong(listenedSong);
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
      <div
        className={`absolute top-0 left-0 h-screen rounded-[32px] w-screen bg-gradient-to-t ${theme.preview} z-0`}
      ></div>
      {/* Sidebar with higher z-index */}

      <EntityHandlingProvider>
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
              <ResizablePanel defaultSize={55} minSize={20}>
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
      </EntityHandlingProvider>
    </div>
  );
};

export default Home;
