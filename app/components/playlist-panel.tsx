"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { SearchBar } from "./search-bar";
import { useSidebar } from "../utils/sidebar-context";
import { useMusicContext } from "../utils/music-context";
import { clsx } from "clsx";
import AudioVisualizer from "./audio-visualizer";
import App from "next/app";
import AppLoadingScreen from "./app-loading";
import { useEntityContext } from "../utils/entity-context";
import { SongOptionsDropdown } from "./song-options-dropdown";
import Image from "next/image";
import { Song } from "../utils/music-context";

const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

export const PlaylistPanel = () => {
  const { selectSong, setSelectSong, playingSong, setPlayingSong } =
    useMusicContext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const { isPlaying, setIsPlaying } = useMusicContext();
  const [selectSongId, setSelectSongId] = useState("1");
  const [playingSongId, setPlayingSongId] = useState("1");
  const { entityName, entityArt, entityType, entityDescription } =
    useEntityContext();
  const { songList, setSongList } = useMusicContext();
  const { searchBar, player, visualizer, setPlayer, setDetailPanel } =
    useSidebar();
  const [openDropdownSongId, setOpenDropdownSongId] = useState<string | null>(
    null
  );
  const handleSongSingleClick = (song: Song) => {
    setSelectSongId(song.id);
    setSelectSong(song);
    setDetailPanel(true);
  };

  const handleSongDoubleClick = (song: Song) => {
    setPlayingSongId(song.id);
    setDetailPanel(true);
    setSelectSongId(song.id);
    setSelectSong(song);
    setPlayingSong(song);
  };

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

  const handleSongOptionsClick = (songId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement your options logic here, e.g., open a modal or dropdown
    setOpenDropdownSongId((prev) => (prev === songId ? null : songId));
    console.log("Options clicked for song ID:", songId);
  };
  const deleteSong = async (songId: string) => {
    try {
      const response = await fetch(
        `${MUSIC_LIBRARY_SERVICE_URL}/files/${songId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use JWT
            "Content-Type": "application/json",
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
      className="relative h-full flex flex-col overflow-y-scroll pt-5"
      onScroll={() => setScrollY(scrollRef.current?.scrollTop || 0)}
    >
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-slate-400/20 to-gray-800/20 backdrop-blur-xl " />
      <div className="inset-0 bg-white/5 backdrop-blur-sm" />

      {searchBar && <SearchBar />}

      <div className="pt-5 relative z-10 h-full flex flex-col">
        <div
          className="p-4 cursor-pointer group transition-all duration-700 ease-out border-b border-white/10 sticky top-0 z-20 backdrop-blur-xl"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.3, 30)}px)`,
          }}
        >
          <div className="flex items-center justify-between">
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
                  src={entityArt ?? "/assets/music-icon.webp"}
                  alt={entityName ?? "Playlist"}
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
                    fontSize: isHeaderCompact
                      ? "2rem"
                      : `${Math.max(2, 6 - scrollY / 50)}rem`,
                    lineHeight: isHeaderCompact ? "2.5rem" : "1",
                    transform: `translateX(${
                      isHeaderCompact ? "-60px" : "0px"
                    })`,
                  }}
                >
                  {entityName}
                </h2>
                <p
                  className="text-white/80 transition-all duration-700 ease-out ml-2 mt-1"
                  style={{
                    fontSize: isHeaderCompact ? "0.875rem" : "1rem",
                    transform: `translateX(${
                      isHeaderCompact ? "-60px" : "0px"
                    })`,
                    opacity: isHeaderCompact ? 0.9 : 0.8,
                  }}
                >
                  {songList.length} songs
                </p>
                {entityDescription !== "" && (
                  <hr className="my-4 border-t border-white/20" />
                )}
                <p className="mt-1 ml-1 text-sm md:text-base text-white/70 leading-relaxed max-w-prose">
                  {entityDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Glass Visualizer Area */}

        <div className="px-4 pt-4">
          <div className="z-10 grid grid-cols-10 gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border bg-white/10 border-white/20">
            <div className="col-span-1 ml-14">#</div>
            <div className="col-span-5 ml-14">Title</div>

            <div className="col-span-3">Album</div>
            <div className="col-span-1">Duration</div>
          </div>
        </div>

        <ScrollArea>
          <div className={clsx("p-4 space-y-2", player ? "pb-56" : "pb-8")}>
            {songList.map((song, id) => (
              <div
                key={song.id}
                className={`flex z-0 items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border hover:scale-[1.01] hover:shadow-lg ${
                  playingSongId === song.id
                    ? "bg-gradient-to-r from-orange-500/30 to-pink-500/20 border-orange-400/40 shadow-lg shadow-orange-500/20"
                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                }`}
                onClick={() => handleSongSingleClick(song)}
                onDoubleClick={() => {
                  handleSongDoubleClick(song);
                  setPlayer(true);

                  setIsPlaying(true); // start playing it
                }}
              >
                <div className="font-medium text-white drop-shadow-sm">
                  {id + 1}
                </div>
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-xl bg-white/10 hover:bg-orange-500/30 border border-white/20 opacity-100 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playingSongId === song.id) {
                        setIsPlaying(!isPlaying); // toggle play/pause
                      } else {
                        handleSongSingleClick(song); // load a new song
                        setPlayer(true);

                        setIsPlaying(true); // start playing it
                      }
                    }}
                  >
                    {isPlaying && playingSongId === song.id ? (
                      <Pause className="h-4 w-4 text-white" />
                    ) : (
                      <Play className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-10 gap-3 w-full items-center">
                  <span className="col-span-6 flex flex-col">
                    <div className="font-medium truncate text-white drop-shadow-sm">
                      {song.title || song.filename}
                    </div>
                    <span className="col-span-text-sm text-white/70 truncate">
                      {song.artist}
                    </span>
                  </span>
                  <span className="col-span-3 text-m text-white/70 truncate">
                    {song.album}
                  </span>
                  <span className="col-span-1 text-center text-white/70 truncate">
                    {song.metadata?.track_length / 60
                      ? `${Math.floor(song.metadata.track_length / 60)}:${
                          Math.floor(song.metadata.track_length % 60) < 10
                            ? "0" + Math.floor(song.metadata.track_length % 60)
                            : Math.floor(song.metadata.track_length % 60)
                        }`
                      : "0:00"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {playingSongId === song.id && isPlaying && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse rounded-full shadow-sm"></div>
                      <div className="w-1 h-2 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse delay-100 rounded-full shadow-sm"></div>
                      <div className="w-1 h-4 bg-gradient-to-t from-orange-400 to-pink-400 animate-pulse delay-200 rounded-full shadow-sm"></div>
                    </div>
                  )}
                  {/* <span className="text-sm text-white/70 font-medium">
                      {song.metadata.duration}
                    </span> */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    onClick={handleSongOptionsClick(song.id)}
                  >
                    <MoreHorizontal className="h-3 w-3 text-white/70" />
                  </Button>
                  {openDropdownSongId === song.id && (
                    <SongOptionsDropdown songId={song.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
