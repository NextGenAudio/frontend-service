"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  Play,
  Pause,
  MoreHorizontal,
  Shuffle,
  Music,
  Users,
  Music2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { SearchBar } from "@/app/components/search-bar";
import { useSidebar } from "@/app/utils/sidebar-context";
import { useMusicContext } from "@/app/utils/music-context";
import { clsx } from "clsx";
import { useEntityContext } from "@/app/utils/entity-context";
import { SongOptionsDropdown } from "@/app/components/song-options-dropdown";
import { useTheme } from "@/app/utils/theme-context";
import { getGeneralThemeColors } from "@/app/lib/theme-colors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Song } from "@/app/utils/music-context";

const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;
const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;

interface Collaborator {
  userId: string;
  role: number;
}
export default function PlaylistPanel({ params }: { params: { id: number } }) {
  const {
    selectSong,
    setSelectSong,
    playingSong,
    setPlayingSong,
    selectSongId,
    setSelectSongId,
    playingSongId,
    setPlayingSongId,
    setSongQueue,
    songQueue,
  } = useMusicContext();
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);

  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const { isPlaying, setIsPlaying } = useMusicContext();
  const [openDropdownSongId, setOpenDropdownSongId] = useState<string | null>(
    null
  );
  const [playlistCollaborators, setPlaylistCollaborators] = useState<
    Collaborator[]
  >([]);
  const { entityName, entityArt, entityType, entityDescription } =
    useEntityContext();
  const { songList, setSongList } = useMusicContext();
  const {
    searchBar,
    player,
    visualizer,
    setPlayer,
    setDetailPanel,
    collaborators,
    setCollaborators,
  } = useSidebar();
  const router = useRouter();
  const handleSongSingleClick = (song: Song) => {
    setSelectSongId(song.id);
    setSelectSong(song);
    setDetailPanel(true);
    setCollaborators(false);
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
      try {
        setLoading(true);
        const sonexUserCookie = Cookies.get("sonex_token");
        const res = await fetch(
          `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/list?playlistId=${params.id}`,
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
        console.log("Songs in playlist:", data);
        setSongList(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCollaborators = async () => {
      try {
        const sonexUserCookie = Cookies.get("sonex_token");
        const res = await fetch(
          `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/${params.id}/collaborators`,
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
        console.log("Playlist collaborators:", data);
        setPlaylistCollaborators(data);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
      }
    };

    fetchSongs();
    fetchCollaborators();
  }, []);

  // Monitor songQueue changes
  useEffect(() => {
    console.log("🎵 Song queue updated:", songQueue);
  }, [songQueue]);

  const removeSongFromPlaylist = async (songId: string) => {
    try {
      const sonexUserCookie = Cookies.get("sonex_token");
      const response = await fetch(
        `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/${params.id}/tracks?musicIds=${songId}`,
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
        console.log("Song removed from playlist successfully");
        // Update state to remove song from UI
        setSongList(songList.filter((song) => song.id !== songId));
      } else {
        const errorText = await response.text();
        console.error("Failed to remove song from playlist:", errorText);
      }
    } catch (err) {
      console.error("Error removing song from playlist:", err);
    }
  };
  const deleteSong = async (songId: string) => {
    try {
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
        // Optional: update state to remove song from UI
        setSongList(songList.filter((song) => song.id !== songId));
      } else {
        const errorText = await response.text();
        console.error("Failed to delete song:", errorText);
      }
    } catch (err) {
      console.error("Error deleting song:", err);
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
          className="h-fit p-5  group transition-all duration-700 ease-out border-b border-white/10 sticky top-0 z-20 backdrop-blur-xl overflow-hidden"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.3, 30)}px)`,
          }}
        >
          {/* Background Image in Right Bottom Corner */}
          <div
            className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-cover bg-center opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/music-icon.webp')",
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
                  width: "208px",
                  height: "208px",
                  opacity: Math.max(0.3, 1 - scrollY / 200),
                  transform: `scale(${Math.max(0.8, 1 - scrollY / 400)})`,
                }}
              >
                <Image
                  src={entityArt ?? "/assets/music-icon.webp"}
                  alt={entityName ?? "Folder"}
                  width={256}
                  height={256}
                  className=" rounded-xl object-cover h-full w-full shadow-md"
                />
                <div className="absolute inset-0" />
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl" />
              </div>

              <div className="hidden sm:block transition-all duration-700 ease-out">
                <h2
                  className="font-extrabold text-white drop-shadow-lg transition-all duration-700 ease-out"
                  style={{
                    fontSize: "5rem",
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

                {/* Collaborators Display */}
                {playlistCollaborators.length > 0 && (
                  <div className="ml-2 mt-3 flex items-center gap-2 flex-wrap">
                    {/* Songs Count - moved here */}
                    <Music2 className="w-4 h-4 text-white/60" />
                    <div className="text-white/80 text-base font-semibold">
                      {songList.length} song{songList.length === 1 ? "" : "s"}
                    </div>
                    {/* Dot separator */}
                    <span className="text-white/60 text-lg font-bold select-none">
                      &bull;
                    </span>
                    <Users className="w-4 h-4 text-white/60" />
                    {playlistCollaborators.map((collaborator, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/20"
                      >
                        {collaborator.userId}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {songList.length > 0 && (
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      onClick={handlePlayAll}
                      className={`bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300`}
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
                    <Button
                      onClick={() => {
                        setCollaborators(true);
                        // Hide other panels when collaborators is shown
                        if (!collaborators) {
                          setDetailPanel(false);
                        }
                      }}
                      variant="outline"
                      className={`${
                        collaborators
                          ? `bg-gradient-to-r ${themeColors.gradient} text-white border-transparent`
                          : `${themeColors.border} ${themeColors.text} ${themeColors.hoverBg}`
                      } px-6 py-3 rounded-full transition-all duration-300`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Collaborators
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Glass Visualizer Area */}

        <div className="px-4 pt-4">
          <div className="flex-1 grid grid-cols-11 gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border bg-white/10 border-white/20">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>

            <div className="col-span-2">Album</div>
            <div className="col-span-2">Plays</div>
            <div className="col-span-1">Duration</div>
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
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${themeColors.gradient} opacity-50 backdrop-blur-sm ${themeColors.border} flex items-center justify-center`}
                  >
                    <Music className={`w-16 h-16 text-white`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No songs found
                </h3>
                <p className="text-white/70 text-lg mb-6 max-w-md">
                  This folder is empty. Upload some music files to get started!
                </p>
                <div className="flex flex-col items-center gap-2 text-white/50">
                  {/* <p className="text-sm">
                    💡 Tip: Drag and drop music files to add them to this folder
                  </p> */}
                </div>
              </div>
            ) : (
              /* Songs List */
              songList.map((song, id) => (
                <div key={song.id}>
                  <div
                    onMouseEnter={() => setHoveredSong(song.id)}
                    onMouseLeave={() => setHoveredSong(null)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer group backdrop-blur-sm border hover:shadow-lg ${
                      playingSongId === song.id
                        ? `bg-gradient-to-r ${themeColors.gradient} bg-opacity-30 ${themeColors.border} ${themeColors.shadow}`
                        : `bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30`
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
                            setSelectSongId(song.id);
                            setSelectSong(song);
                            setPlayingSongId(song.id);
                            setPlayingSong(song);
                            setPlayer(true);
                            setIsPlaying(true);
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

                    <div className="grid grid-cols-10 gap-3 w-full items-center ">
                      <span className="col-span-5 flex flex-col">
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
                      <span className="col-span-2 text-m text-white/70 ">
                        {song.listenCount}
                      </span>
                      <span className="col-span-1 text-center text-white/70 truncate">
                        {song?.metadata.track_length / 60
                          ? `${Math.floor(song?.metadata.track_length / 60)}:${
                              Math.floor(song?.metadata.track_length % 60) < 10
                                ? "0" +
                                  Math.floor(song?.metadata.track_length % 60)
                                : Math.floor(song?.metadata.track_length % 60)
                            }`
                          : "0:00"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {playingSongId === song.id && isPlaying && (
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-1 h-3 bg-gradient-to-t ${themeColors.gradient} animate-pulse rounded-full shadow-sm`}
                          ></div>
                          <div
                            className={`w-1 h-2 bg-gradient-to-t ${themeColors.gradient} animate-pulse delay-100 rounded-full shadow-sm`}
                          ></div>
                          <div
                            className={`w-1 h-4 bg-gradient-to-t ${themeColors.gradient} animate-pulse delay-200 rounded-full shadow-sm`}
                          ></div>
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
                      isInPlaylist={true}
                      onAddToQueue={() => {
                        console.log("Adding to queue from playlist page");

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
                      onRemoveFromPlaylist={() => {
                        removeSongFromPlaylist(song.id);
                        setOpenDropdownSongId(null);
                      }}
                      onDelete={() => {
                        deleteSong(song.id);
                        setOpenDropdownSongId(null);
                      }}
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
                  router.push(`/player/playlist/update?playlistId=${params.id}`)
                }
                variant="outline"
                className={`${themeColors.border} ${themeColors.text} ${themeColors.hoverBg} px-8 py-3 rounded-full `}
              >
                <Music className="w-5 h-5 mr-2" />+ More Musics
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
