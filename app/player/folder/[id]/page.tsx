"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  MoreHorizontal,
  Shuffle,
  Music,
  Music2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useSidebar } from "@/app/utils/sidebar-context";
import { useMusicContext } from "@/app/utils/music-context";
import { clsx } from "clsx";
import { useEntityContext } from "@/app/utils/entity-context";
import { SongOptionsDropdown } from "@/app/components/song-options-dropdown";
import { useTheme } from "@/app/utils/theme-context";
import { getGeneralThemeColors } from "@/app/lib/theme-colors";
import AlertBar from "@/app/components/alert-bar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Song } from "@/app/utils/music-context";
import { useFileHandling } from "@/app/utils/entity-handling-context";
import Cookies from "js-cookie";
import axios from "axios";
import { SearchBar } from "@/app/components/search-bar";

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;
const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

export default function FolderPanel({ params }: { params: { id: number } }) {
  const {
    selectSong,
    setSelectSong,
    playingSong,
    setPlayingSong,
    selectSongId,
    setSelectSongId,
    playingSongId,
    setPlayingSongId,
    isPlaying,
    setIsPlaying,
    songQueue,
    setSongQueue,
  } = useMusicContext();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  // Alert state for showing success/error messages
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  // Get theme-specific colors
  const themeColors = getGeneralThemeColors(theme.primary);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [openDropdownSongId, setOpenDropdownSongId] = useState<string | null>(
    null
  );
  const { entityName, entityArt, entityDescription } = useEntityContext();
  const { songList, setSongList } = useMusicContext();
  const { searchBar, player, visualizer, setPlayer, setDetailPanel } =
    useSidebar();
  // Add caching to prevent duplicate requests
  const [cache, setCache] = useState<Map<number, Song[]>>(new Map());
  const [loadingStates] = useState<Set<number>>(new Set());
  const { setSongUploadRefresh } = useFileHandling();
  const handleSongSingleClick = (song: Song) => {
    setSelectSongId(song.id);
    setSelectSong(song);
    setDetailPanel(true);
  };

  const handleSongDoubleClick = (song: Song) => {
    handleSongSingleClick(song);
    setPlayingSongId(song.id);
    setPlayingSong(song);
    const newScore = (song?.xscore ?? 0) + 1;
    const sonexUserCookie = Cookies.get("sonex_token");
    fetch(
      `${MUSIC_LIBRARY_SERVICE_URL}/files/${song.id}/score?score=${newScore}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          ...(sonexUserCookie
            ? { Authorization: `Bearer ${sonexUserCookie}` }
            : {}),
        },
      }
    ).catch((err) => console.error("Failed to update song score", err));
    song.xscore = newScore; // Optimistically update score in UI
  };

  const handlePlayAll = () => {
    if (songList.length > 0) {
      const firstSong = songList[0];
      handleSongDoubleClick(firstSong);
      setPlayer(true);
      setIsPlaying(true);
    }
  };

  const handleShuffle = () => {
    if (songList.length > 0) {
      const randomIndex = Math.floor(Math.random() * songList.length);
      const randomSong = songList[randomIndex];
      handleSongDoubleClick(randomSong);
      setPlayer(true);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const folderId = params.id;
      // Check cache first
      if (cache.has(folderId)) {
        setSongList(cache.get(folderId)!);
        setLoading(false);
        return;
      }

      // Check if already loading
      if (loadingStates.has(folderId)) {
        return;
      }
      try {
        setLoading(true);
        const sonexUserCookie = Cookies.get("sonex_token");
        const res = await fetch(
          `${MUSIC_LIBRARY_SERVICE_URL}/files/list?folderId=${folderId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              ...(sonexUserCookie
                ? { Authorization: `Bearer ${sonexUserCookie}` }
                : {}),
            },
          }
        );
        const data = await res.json();
        console.log("Songs in folder:", data);
        setCache((prev) => new Map(prev).set(folderId, data));
        setSongList(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        setScrollY(scrollTop);

        setIsHeaderCompact(scrollTop > 120);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, { passive: true });
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);
  const deleteSong = async (songId: string) => {
    try {
      // Optimistically update UI first
      const updatedSongList = songList.filter((song) => song.id !== songId);
      setSongList(updatedSongList);

      // Update cache as well
      const folderId = params.id;
      setCache((prev) => new Map(prev).set(folderId, updatedSongList));

      const sonexUserCookie = Cookies.get("sonex_token");
      const response = await fetch(
        `${MUSIC_LIBRARY_SERVICE_URL}/files/${songId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(sonexUserCookie
              ? { Authorization: `Bearer ${sonexUserCookie}` }
              : {}),
          },
        }
      );

      if (response.ok) {
        console.log("Song deleted successfully");
        setAlertMessage("✅ Song deleted successfully");
        // Trigger refresh for other components that might need to update
        setSongUploadRefresh((prev) => prev + 1);
      } else {
        const errorText = await response.text();
        console.error("Failed to delete song:", errorText);

        // Rollback the optimistic update if the API call failed
        setSongList(songList);
        setCache((prev) => new Map(prev).set(folderId, songList));
        setAlertMessage("❌ Failed to delete song");
      }
    } catch (err) {
      console.error("Error deleting song:", err);

      // Rollback the optimistic update if there was an error
      setSongList(songList);
      const folderId = params.id;
      setCache((prev) => new Map(prev).set(folderId, songList));
      setAlertMessage("❌ Error deleting song");
    }
  };

  async function publishSong(songId: string) {
    const userDataStr: any = Cookies.get("sonex_user");
    if (!userDataStr) return;
    let userData;
    try {
      userData = JSON.parse(userDataStr);
    } catch {
      return;
    }
    if (!userData || !userData.profileId) return;
    const artistData = await fetchArtistData(userData.profileId);
    if (!artistData || !artistData.artistId || !artistData.artistName) return;
    const sonexUserCookie = Cookies.get("sonex_token");
    try {
      const response = await axios.post(
        `${MUSIC_LIBRARY_SERVICE_URL}/public/music/publish?artistId=${
          artistData.artistId
        }&artistName=${encodeURIComponent(
          artistData.artistName
        )}&musicId=${songId}`,
        {},
        {
          headers: {
            Authorization: sonexUserCookie ? `Bearer ${sonexUserCookie}` : "",
          },
        }
      );
      console.log("Publish response:", response.data);
      setAlertMessage("✅ Song published successfully");
    } catch (err) {
      console.error("Error publishing song:", err);
      setAlertMessage("❌ Error publishing song");
    }
  }

  const fetchArtistData = async (profileId: number) => {
    try {
      const res = await axios.get(
        `${USER_MANAGEMENT_SERVICE_URL}/artists?profileId=${profileId}`
      );

      console.log("Artist data:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching artist data:", error);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="relative h-full flex flex-col"
      onScroll={() => setScrollY(scrollRef.current?.scrollTop || 0)}
    >
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-slate-500/10 to-gray-800/20 backdrop-blur-xl " />
      {/* <div className="inset-0 bg-white/5 backdrop-blur-sm" /> */}
      {searchBar && <SearchBar />}
      <div className="pt-3 relative z-10 h-full flex flex-col">
        <div
          className="h-fit p-5 cursor-pointer group transition-all duration-700 ease-out border-b border-white/10 sticky top-0 z-20 backdrop-blur-xl overflow-hidden"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.3, 30)}px)`,
          }}
        >
          {/* Background Image in Right Bottom Corner */}
          <div
            className="absolute bottom-0 right-10 w-[260px] h-[200px] bg-cover bg-center opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/file-icon-back2.webp')",
              transform: `translateX(30px) translateY(20px)`,
              maskImage:
                "linear-gradient(to top left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to top left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div
                className="rounded-xl  overflow-hidden relative flex-shrink-0 transition-all duration-700 ease-out"
                style={{
                  width: isHeaderCompact ? "60px" : "208px",
                  height: isHeaderCompact ? "60px" : "208px",
                  opacity: isHeaderCompact
                    ? 0
                    : Math.max(0.3, 1 - scrollY / 200),
                  transform: `scale(${
                    isHeaderCompact ? 0.3 : Math.max(0.8, 1 - scrollY / 400)
                  })`,
                }}
              >
                <Image
                  src={entityArt ?? "/assets/file-icon.webp"}
                  alt={entityName ?? "Folder"}
                  className=" rounded-xl object-cover h-full w-full shadow-md"
                  width={256}
                  height={256}
                />
                <div className="absolute inset-0" />
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl" />
              </div>

              <div className="hidden sm:block transition-all duration-700 ease-out">
                <h2
                  className="font-extrabold text-white drop-shadow-lg transition-all duration-700 ease-out"
                  style={{
                    fontSize: "5rem",
                    lineHeight: "5rem",
                  }}
                >
                  {entityName}
                </h2>
                <p className="ml-1 text-sm md:text-base text-white/70 leading-relaxed max-w-prose mt-2">
                  {entityDescription}
                </p>
                {entityDescription !== "" && (
                  <hr className="mt-2 mb-2 border-t border-white/20" />
                )}
                {/* Songs Count - moved here */}
                <div className="ml-2 mt-3 flex items-center gap-2 flex-wrap">
                  <Music2 className="w-4 h-4 text-white/60" />
                  <div className="text-white/80 text-base font-semibold">
                    {songList.length} song{songList.length === 1 ? "" : "s"}
                  </div>
                </div>
                {/* Action Buttons */}
                {!isHeaderCompact && songList.length > 0 && (
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      onClick={handlePlayAll}
                      className={`bg-gradient-to-r ${theme.preview} hover:${themeColors.gradient} text-white font-semibold px-8 py-3 rounded-full transition-all duration-300`}
                    >
                      <Play className="w-5 h-5 mr-2" fill="currentColor" />
                      Play All
                    </Button>
                    <Button
                      onClick={handleShuffle}
                      variant="outline"
                      className={`${themeColors.border} ${themeColors.text} ${themeColors.hoverBg} px-6 py-3 rounded-full transition-all duration-300`}
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Shuffle
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Glass Visualizer Area */}

        <div className="px-4 pt-4 flex">
          <div className="grid grid-cols-10 gap-3 w-full p-3 rounded-xl  transition-all duration-300 group backdrop-blur-sm border bg-white/10 border-white/20">
            <div className="col-span-1">#</div>
            <div className="col-span-5 ">Title</div>

            <div className="col-span-2">Album</div>
            <div className="col-span-1">Plays</div>
            <div className="col-span-1 mr-4">Duration</div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className={clsx("p-4 space-y-2", player ? "pb-56" : "pb-8")}>
            {loading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16">
                  <Music
                    className={`w-8 h-8 ${themeColors.text} animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                  />
                  <div
                    className={`w-16 h-16 border-4 ${themeColors.border} border-t-current rounded-full animate-spin`}
                  />
                </div>
                <p className="text-white/70 mt-4 text-lg">Loading songs...</p>
              </div>
            ) : songList.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center pt-20 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Music className={`w-16 h-16 ${themeColors.text}/60`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No songs found
                </h3>
                <p className="text-white/70 text-lg mb-6 max-w-md">
                  This folder is empty. Upload some music files to get started!
                </p>
                <div className="flex flex-col items-center gap-2 text-white/50"></div>
              </div>
            ) : (
              /* Songs List */
              songList?.map((song, id) => (
                <div key={song.id}>
                  <div
                    onMouseEnter={() => setHoveredSong(song.id)}
                    onMouseLeave={() => setHoveredSong(null)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer  group backdrop-blur-sm border hover:shadow-lg ${
                      playingSongId === song.id
                        ? `bg-gradient-to-r ${theme.preview} border-white/40 shadow-lg ${themeColors.shadow}`
                        : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                    } ${
                      openDropdownSongId === song.id ? "relative z-[10000]" : ""
                    }`}
                    onClick={() => handleSongSingleClick(song)}
                    onDoubleClick={() => {
                      handleSongDoubleClick(song);
                      setPlayer(true);
                      setIsPlaying(true); // start playing it
                    }}
                  >
                    <div className="col-span-1  flex items-center justify-center mx-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-9 w-9 rounded-xl bg-white/10 ${themeColors.hoverBg} border border-white/20 opacity-100 group-hover:opacity-100 transition-all duration-300 `}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (playingSongId === song.id) {
                            setIsPlaying(!isPlaying); // toggle play/pause
                          } else {
                            setPlayingSongId(song.id);
                            setSelectSongId(song.id);
                            setSelectSong(song);
                            setPlayingSong(song);
                            setIsPlaying(true); // start playing it
                          }
                        }}
                      >
                        {playingSong?.id === song.id ? (
                          <div
                            className="w-4 h-4 text-white flex items-center justify-center"
                            style={{ color: theme.primary }}
                          >
                            {isPlaying ? (
                              <Pause fill="white" />
                            ) : (
                              <Play fill="white" />
                            )}
                          </div>
                        ) : hoveredSong === song.id ? (
                          <Play className="w-4 h-4" fill="white" />
                        ) : (
                          <span className="font-medium text-white drop-shadow-sm">
                            {id + 1}
                          </span>
                        )}
                      </Button>
                    </div>
                    <div className="grid grid-cols-11 gap-3 w-full items-center">
                      <span className="col-span-6 flex flex-col">
                        <div className="font-medium truncate text-white drop-shadow-sm">
                          {song.title || song.filename}
                        </div>
                        <span className="col-span-text-sm text-white/70 truncate">
                          {song.artist}
                        </span>
                      </span>
                      <span className="col-span-2 text-m text-white/70 truncate">
                        {song.album}
                      </span>
                      <span className="col-span-2 text-m text-white/70 truncate ">
                        {song.listenCount || 0}
                      </span>
                      <span className="col-span-1 text-center text-white/70 truncate">
                        {(() => {
                          const raw = song?.metadata?.track_length;
                          const lengthSec =
                            typeof raw === "number" ? raw : Number(raw ?? 0);
                          if (!lengthSec) return "0:00";
                          const mins = Math.floor(lengthSec / 60);
                          const secs = Math.floor(lengthSec % 60);
                          return `${mins}:${secs < 10 ? "0" + secs : secs}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {playingSongId === song.id && isPlaying && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-3 bg-gradient-to-t from-white to-slate-200 animate-pulse rounded-full shadow-sm"></div>
                          <div className="w-1 h-2 bg-gradient-to-t from-white to-slate-200 animate-pulse delay-100 rounded-full shadow-sm"></div>
                          <div className="w-1 h-4 bg-gradient-to-t from-white to-slate-200 animate-pulse delay-200 rounded-full shadow-sm"></div>
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownSongId(
                            openDropdownSongId === song.id ? null : song.id
                          );
                        }}
                      >
                        <MoreHorizontal className="h-3 w-3 text-white/70" />
                      </Button>
                    </div>
                  </div>
                  {openDropdownSongId === song.id && (
                    <SongOptionsDropdown
                      songId={song.id}
                      isInPlaylist={false}
                      onAddToQueue={() => {
                        console.log("Adding to queue from folder page");
                        // Use functional update to get the latest queue state
                        setSongQueue((currentQueue: Song[]) => {
                          // Check if song is already in the current queue
                          const isInQueue = currentQueue.find(
                            (s: Song) => s.id === song.id
                          );

                          if (isInQueue) {
                            // Remove from queue if already present
                            return currentQueue.filter(
                              (s: Song) => s.id !== song.id
                            );
                          } else {
                            // Add to front of queue if not present
                            return [song, ...currentQueue];
                          }
                        });
                      }}
                      onDelete={() => {
                        deleteSong(song.id);
                        setOpenDropdownSongId(null);
                      }}
                      onPublish={() => publishSong(song.id)}
                      onClose={() => setOpenDropdownSongId(null)}
                    />
                  )}
                </div>
              ))
            )}

            {/* Add More Music Button */}
            <div className="flex justify-center pb-4 pt-6">
              <Button
                onClick={() =>
                  router.push(`/player/upload?folderId=${params.id}`)
                }
                variant="outline"
                className={`${themeColors.border} ${themeColors.text} ${themeColors.hoverBg} px-8 py-3 rounded-full `}
              >
                <Music className="w-5 h-5 mr-2" />+ More Musics
              </Button>
            </div>
          </div>
        </ScrollArea>
        {alertMessage && (
          <AlertBar
            message={alertMessage as string}
            setMessage={setAlertMessage}
          />
        )}
      </div>
    </div>
  );
}
