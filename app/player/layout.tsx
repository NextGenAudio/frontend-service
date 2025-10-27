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
import { QueuePanel } from "../components/queue-panel";
import { CollaboratorsPanel } from "../components/collaborators-panel";
import { EntityHandlingProvider } from "../utils/entity-handling-context";
import AudioVisualizer from "../components/audio-visualizer";
import { ProfileDropdown } from "../components/profile-dropdown";
import { useRouter } from "next/navigation";
import { useTheme } from "../utils/theme-context";
import { AudioManager } from "../utils/audio-manager";
import axios from "axios";
import Cookies from "js-cookie";
import { ProfileUpdatePanel } from "../components/profile-update-panel";
import { SearchBar } from "../components/search-bar";

const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

const Home = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { theme } = useTheme();
  const {
    player,
    profileUpdate,
    profile,
    detailPanel,
    visualizer,
    queue,
    searchBar,
    collaborators,
  } = useSidebar();

  const {
    setIsPlaying,
    selectSong,
    isPlaying,
    playingSong,
    setPlayingSong,
    soundRef,
    setPlayingSongDuration,
    repeatMode,
    songList,
    setSelectSong,
    setSelectSongId,
    setPlayingSongId,
    songQueue,
    setSongQueue,
    shuffleQueue,
  } = useMusicContext();

  const { volume, isMuted } = usePlayerSettings();
  const router = useRouter();

  // Add state to track if we're using recommendations
  const [usingRecommendations, setUsingRecommendations] = useState(false);

  // Get AudioManager instance
  const audioManager = AudioManager.getInstance();

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
    // Only update the global playing song when the selected song is the one
    // that should be played (i.e. when selectSong.id matches playingSongId).
    // This prevents a mere selection (viewing details) from causing playback
    // to switch if the user previously started playback.
    if (!selectSong) return;
    // Only proceed when the selected song is the one intended to play
    if (!playingSong || selectSong.id !== playingSong.id) return;

    const url = `${MUSIC_LIBRARY_SERVICE_URL}/files/download/${selectSong.id}`;
    console.log("Song URL:", url);

    // Update state with direct backend URL
    setPlayingSong({
      ...selectSong,
      source: url,
    });

    // Cleanup object URL if you used Blob before
    return () => {
      if (playingSong?.source?.startsWith("blob:")) {
        URL.revokeObjectURL(playingSong.source);
      }
    };
  }, [selectSong?.id, playingSong?.id]);

  function handleSongDoubleClick(song: any) {
    setPlayingSongId(song.id);
    setSelectSongId(song.id);
    setSelectSong(song);
    setPlayingSong(song);
    console.log("Song Queue", songQueue);
  }

  const handleNextClick = (playedSong: Song) => {
    console.log("Current Song Queue:", songQueue);
    const newQueue = [...songQueue]; // ✅ Declare as const inside the function
    const playedSongIndex = newQueue.findIndex((s) => s.id === playedSong?.id);
    newQueue.splice(playedSongIndex, 1);
    setSongQueue(newQueue);

    console.log("Song Queue after shift (newQueue)", newQueue);
    if (!newQueue.length || !playingSong) return;
    const currentIndex = newQueue.findIndex((s) => s.id === playingSong?.id);
    
    const sonexUserCookie = Cookies.get("sonex_token");
    if (newQueue.length < 2) {
      axios
        .get(
          `${MUSIC_LIBRARY_SERVICE_URL}/files/recommendations?genre=${playingSong?.genre},mood=${playingSong?.mood},artist=${playingSong?.artist}`,
          {
            withCredentials: true,
            headers: {
              Authorization: sonexUserCookie ? `Bearer ${sonexUserCookie}` : "",
            },
          }
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
          if (error?.response) {
            console.error("recommendations response status:", error.response.status);
            console.error("recommendations response headers:", error.response.headers);
            console.error("recommendations response data:", error.response.data);
          }
        });
      return; // ✅ Important: return here to avoid playing song twice
    }

    // Only execute this if we didn't fetch recommendations
    let nextIndex = 0;
    if (!shuffleQueue) {
      nextIndex = (currentIndex + 1) % newQueue.length;
    } else {
      nextIndex = Math.floor(Math.random() * newQueue.length);
    }
    const nextSong = newQueue[nextIndex];
    console.log("Playing next song from existing queue:", nextSong?.title);
    handleSongDoubleClick(nextSong);
    setIsPlaying(true);
  };

  // Update listen count and last listened timestamp
  const updateListenedSong = (listenedSong: Song) => {
    listenedSong.lastListenedAt = new Date(); // Update local object
    const sonexUserCookie = Cookies.get("sonex_token");
    listenedSong.listenCount = (listenedSong.listenCount || 0) + 1;
    axios
      .post(
        `${MUSIC_LIBRARY_SERVICE_URL}/files/${listenedSong.id}/listen_count?count=${listenedSong.listenCount}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: sonexUserCookie ? `Bearer ${sonexUserCookie}` : "",
          },
        }
      )
      .then((response) => {
        console.log("Listen timestamp updated:", response.data);
      })
      .catch((err) => {
        console.error("Failed to update listen timestamp", err);
        if (err?.response) {
          console.error("listen_count response status:", err.response.status);
          console.error("listen_count response headers:", err.response.headers);
          console.error("listen_count response data:", err.response.data);
        }
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

    console.log("🎵 Creating new audio instance for:", playingSong.source);

    // Create audio with CORS support using AudioManager
    audioManager
      .createHowl({
        src: [playingSong.source],
        html5: true, // Use HTML5 for better compatibility
        volume: isMuted ? 0 : volume / 100,
        preload: true,
        loop: repeatMode === 1,
        format: ["mp3", "wav", "ogg", "aac", "m4a"], // Specify supported formats
        corsConfig: {
          enabled: true,
          mode: "use-credentials",
        },
        onload: () => {
          console.log("✅ Audio loaded successfully:", playingSong.title);
          setPlayingSongDuration(playingSong?.metadata?.track_length || 0);

          // Auto-play if needed
          if (isPlaying && soundRef.current && !soundRef.current.playing()) {
            soundRef.current.play();
          }
        },
        onloaderror: (id: number, error: any) => {
          console.error("❌ Audio load error:", error);

          // Try fallback without CORS as last resort
          if (playingSong?.source) {
            console.log("🔄 Trying fallback without CORS...");
            audioManager
              .createHowl({
                src: [playingSong.source],
                html5: false, // Try Web Audio API
                volume: isMuted ? 0 : volume / 100,
                preload: true,
                loop: repeatMode === 1,
                format: ["mp3", "wav", "ogg", "aac", "m4a"],
                corsConfig: {
                  enabled: false,
                },
                onload: () => {
                  console.log("✅ Fallback audio loaded");
                  setPlayingSongDuration(
                    playingSong?.metadata?.track_length || 0
                  );
                  if (
                    isPlaying &&
                    soundRef.current &&
                    !soundRef.current.playing()
                  ) {
                    soundRef.current.play();
                  }
                },
                onloaderror: (id: number, fallbackError: any) => {
                  console.error(
                    "❌ Fallback audio also failed:",
                    fallbackError
                  );
                },
                onplay: () => setIsPlaying(true),
                onpause: () => setIsPlaying(false),
                onend: () => {
                  const listenedSong = playingSong;
                  setIsPlaying(false);
                  handleNextClick(listenedSong);
                  updateListenedSong(listenedSong);
                },
              })
              .then((fallbackSound) => {
                soundRef.current = fallbackSound;
              })
              .catch((err) => {
                console.error("❌ AudioManager createHowl failed:", err);
              });
          }
        },
        onplay: () => {
          console.log("🎵 Audio playing");
          setIsPlaying(true);
        },
        onpause: () => {
          console.log("🎵 Audio paused");
          setIsPlaying(false);
        },
        onend: () => {
          console.log("🎵 Audio ended");
          const listenedSong = playingSong;
          setIsPlaying(false);
          handleNextClick(listenedSong);
          updateListenedSong(listenedSong);
        },
      })
      .then((sound) => {
        soundRef.current = sound;
        console.log("🎵 SoundRef updated with new Howl instance");
      })
      .catch((error) => {
        console.error("❌ AudioManager createHowl failed:", error);
      });

    return () => {
      // Cleanup is handled by AudioManager
      audioManager.cleanup();
    };
  }, [playingSong?.source, volume, isMuted, repeatMode]);

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
              <ResizablePanel defaultSize={20} minSize={20} maxSize={25}>
                <div className="relative z-10 h-full">
                  <LibraryPanel />
                </div>
              </ResizablePanel>
              <ResizableHandle className="w-[2px] bg-white/20 hover:bg-white/40 transition-colors" />
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
                    <div className="h-full relative z-0">{children}</div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle className="w-[2px] bg-white/20 hover:bg-white/40 transition-colors" />
              {(profileUpdate || detailPanel || queue || collaborators) && (
                <ResizablePanel defaultSize={22} minSize={20} maxSize={25}>
                  <ResizablePanelGroup direction="vertical">
                    {profileUpdate && (
                      <ResizablePanel defaultSize={50} minSize={0}>
                        <div className="p-4">
                          <ProfileUpdatePanel />
                        </div>
                      </ResizablePanel>
                    )}
                    {queue && (
                      <ResizablePanel defaultSize={50} minSize={0}>
                        <QueuePanel />
                      </ResizablePanel>
                    )}
                    {collaborators && (
                      <>
                        <ResizableHandle className="w-1 bg-white/20 hover:bg-white/40 transition-colors" />
                        <ResizablePanel defaultSize={50} minSize={0}>
                          <CollaboratorsPanel />
                        </ResizablePanel>
                      </>
                    )}
                    <ResizableHandle className="w-1 bg-white/20 hover:bg-white/40 transition-colors" />
                    {detailPanel && (
                      <ResizablePanel defaultSize={50} minSize={0}>
                        <SongDetailsPanel song={selectSong} />
                      </ResizablePanel>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </div>

          {player && (
            <FloatingPlayerControls
              song={playingSong}
              handleNextClick={handleNextClick}
            />
          )}
        </div>
      </EntityHandlingProvider>
    </div>
  );
};

export default Home;
