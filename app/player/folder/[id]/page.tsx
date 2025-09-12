"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { SearchBar } from "@/app/components/search-bar";
import { useSidebar } from "@/app/utils/sidebar-context";
import { useMusicContext } from "@/app/utils/music-context";
import { clsx } from "clsx";
import { useEntityContext } from "@/app/utils/entity-context";
import { SongOptionsDropdown } from "@/app/components/song-options-dropdown";

interface Song {
  id: string;
  title: string | undefined;
  filename: string;
  artist: string | undefined;
  album: string | undefined;
  path: string;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  isLiked: boolean;
}

export default function FolderPanel({ params }: { params: { id: number } }) {
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
  const [openDropdownSongId, setOpenDropdownSongId] = useState<string | null>(
    null
  );
  const {
    entityName,
    entityArt,
    entityType,
    entityDescription,
    setEntityName,
    setEntityArt,
    setEntityType,
    setEntityDescription,
  } = useEntityContext();
  const { songList, setSongList } = useMusicContext();
  const { searchBar, player, visualizer, setPlayer, setDetailPanel } =
    useSidebar();
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
    const fetchSongs = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/files/list?folderId=${params.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Songs in folder:", data);
        setSongList(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };
    fetchSongs();
  }, []);

  const deleteSong = async (songId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/files/${songId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    >
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-slate-500/20 to-gray-800/20 backdrop-blur-xl " />
      {/* <div className="inset-0 bg-white/5 backdrop-blur-sm" /> */}

      {searchBar && <SearchBar />}

      <div className="pt-5 relative z-10 h-full flex flex-col">
        {/* Main Header */}
        <div 
          className={`p-4 cursor-pointer group border-b border-white/10 z-20 transition-all duration-500 ease-out ${
            isHeaderCompact ? 'fixed top-0 left-0 right-0 backdrop-blur-xl bg-gray-900/90' : ''
          }`}
          style={{
            marginLeft: isHeaderCompact && searchBar ? "0" : isHeaderCompact ? "280px" : "0",
            width: isHeaderCompact && searchBar ? "100%" : isHeaderCompact ? "calc(100% - 280px)" : "100%",
            transform: isHeaderCompact ? 'scale(0.6)' : 'scale(1)',
            transformOrigin: 'top left'
          }}
        >
          <div className=" flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl overflow-hidden relative flex-shrink-0 w-52 h-52">
                <img
                  src={entityArt ?? undefined}
                  alt={entityName ?? undefined}
                  className="rounded-xl object-cover h-full w-full shadow-md"
                />
                <div className="absolute inset-0" />
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl" />
              </div>

              <div className="hidden sm:block">
                <h2 className="font-extrabold text-white drop-shadow-lg text-6xl">
                  {entityName}
                </h2>
                <p className="text-white/80 ml-2 mt-2 text-base">
                  {songList.length} songs
                </p>
                {entityDescription !== "" && (
                  <>
                    <hr className="my-4 border-t border-white/20" />
                    <p className="mt-1 ml-1 text-sm md:text-base text-white/70 leading-relaxed max-w-prose">
                      {entityDescription}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Header - Sticky */}
        <div
          className="sticky top-0 z-[10002] px-4 pt-4 pb-2 backdrop-blur-xl bg-gray-800/10"
          style={{
            marginTop: isHeaderCompact ? "60px" : "0px",
            transition: "margin-top 0.5s ease-out",
          }}
        >
          <div className="grid grid-cols-10 gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border bg-white/5 border-white/20">
            <div className="col-span-1">#</div>
            <div className="col-span-5 ">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-1">Duration</div>
          </div>
        </div>

        <div
          className={clsx(
            "px-4 space-y-2 transition-all duration-500",
            player ? "pb-56" : "pb-8"
          )}
        >
          {songList.map((song, id) => (
            <div
              key={song.id}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border hover:scale-[1.01] hover:shadow-lg ${
                playingSongId === song.id
                  ? "bg-gradient-to-r from-orange-500/30 to-pink-500/20 border-orange-400/40 shadow-lg shadow-orange-500/20"
                  : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 "
              } ${openDropdownSongId === song.id ? "relative z-[10000]" : ""}`}
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
                {openDropdownSongId === song.id && (
                  <SongOptionsDropdown
                    songId={song.id}
                    onDelete={() => {
                      deleteSong(song.id);
                      setOpenDropdownSongId(null);
                    }}
                    onClose={() => setOpenDropdownSongId(null)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
