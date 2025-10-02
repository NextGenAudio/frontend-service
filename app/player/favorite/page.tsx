"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  MoreHorizontal,
  Heart,
  Shuffle,
  Music,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { SearchBar } from "@/app/components/search-bar";
import { useSidebar } from "@/app/utils/sidebar-context";
import { useMusicContext } from "@/app/utils/music-context";
import { clsx } from "clsx";
import { SongOptionsDropdown } from "@/app/components/song-options-dropdown";
import { useTheme } from "@/app/utils/theme-context";
import { getGeneralThemeColors } from "@/app/lib/theme-colors";
import { set } from "react-hook-form";
import { Song } from "@/app/utils/music-context";

export default function FavoritePage() {
  const { selectSong, setSelectSong, playingSong, setPlayingSong } =
    useMusicContext();
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favoritesSongs, setFavoritesSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying, setIsPlaying } = useMusicContext();
  const [selectSongId, setSelectSongId] = useState("1");
  const [playingSongId, setPlayingSongId] = useState("1");
  const [openDropdownSongId, setOpenDropdownSongId] = useState<string | null>(
    null
  );
  const { searchBar, player, setPlayer, setDetailPanel } = useSidebar();

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

  const handlePlayAll = () => {
    if (favoritesSongs.length > 0) {
      const firstSong = favoritesSongs[0];
      handleSongDoubleClick(firstSong);
      setPlayer(true);
      setIsPlaying(true);
    }
  };

  const handleShuffle = () => {
    if (favoritesSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * favoritesSongs.length);
      const randomSong = favoritesSongs[randomIndex];
      handleSongDoubleClick(randomSong);
      setPlayer(true);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/files/favorite", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        setFavoritesSongs(data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (songId: string) => {
    try {
      // TODO: API call to remove from favorites
      setFavoritesSongs(favoritesSongs.filter((song) => song.id !== songId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Dynamic Background with Heart Pattern - Fixed */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-slate-500/20 to-gray-800/20 backdrop-blur-xl" />
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute top-10 left-10 ${themeColors.text}`}>
          <Heart className="w-8 h-8 animate-pulse" />
        </div>
        <div className={`absolute top-32 right-20 ${themeColors.text}`}>
          <Heart className="w-6 h-6 animate-pulse delay-1000" />
        </div>
        <div className={`absolute top-64 left-1/3 ${themeColors.text}`}>
          <Heart className="w-4 h-4 animate-pulse delay-2000" />
        </div>
        <div className={`absolute bottom-32 right-1/4 ${themeColors.text}`}>
          <Heart className="w-5 h-5 animate-pulse delay-500" />
        </div>
      </div>

      {/* Fixed SearchBar */}
      {searchBar && (
        <div className="relative z-30 flex-shrink-0">
          <SearchBar />
        </div>
      )}

      {/* Fixed Header */}
      <div className="relative z-20 flex-shrink-0 pt-5">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Animated Heart Icon */}
              <div className="relative flex-shrink-0 w-40 h-40">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${theme.preview}  backdrop-blur-sm border ${themeColors.border} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Animated background circles */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${theme.preview} animate-pulse`}
                  />
                  <div
                    className={`absolute inset-2 rounded-full bg-gradient-to-br ${theme.preview}  animate-pulse delay-1000`}
                  />

                  <Heart
                    className="w-12 h-12 text-white drop-shadow-lg"
                    fill="currentColor"
                  />

                  {/* Floating hearts animation */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Heart
                      className={`absolute top-2 right-2 w-3 h-3 ${themeColors.text} animate-bounce delay-500`}
                      fill="currentColor"
                    />
                    <Heart
                      className={`absolute bottom-2 left-2 w-2 h-2 ${themeColors.text} animate-bounce delay-1500`}
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <h1
                  className={`text-4xl font-extrabold text-transparent bg-clip-text text-white drop-shadow-lg pb-2`}
                >Loved Musics</h1>
                <p className="text-white/80text-lg flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
                  {favoritesSongs.length} favorites
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-6">
                  <Button
                    onClick={handlePlayAll}
                    disabled={favoritesSongs.length === 0}
                    className={`bg-gradient-to-r ${theme.preview} hover:${themeColors.gradient} text-white font-semibold px-8 py-3 rounded-full ${themeColors.shadow} transition-all duration-300 hover:scale-105 disabled:opacity-50`}
                  >
                    <Play className="w-5 h-5 mr-2" fill="currentColor" />
                    Play All
                  </Button>
                  <Button
                    onClick={handleShuffle}
                    disabled={favoritesSongs.length === 0}
                    variant="outline"
                    className={`${themeColors.border} ${themeColors.text} ${themeColors.hoverBg} px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50`}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Shuffle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Header - Fixed */}
        <div className="px-4 pt-4 pb-2 backdrop-blur-xl bg-gray-800/40">
          <div className="grid grid-cols-10 gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border bg-white/10 border-white/20">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-1">Duration</div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10">
        <div
          className={clsx(
            "px-4 space-y-2 transition-all duration-500",
            player ? "pb-56" : "pb-8"
          )}
        >
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Heart
                  className={`w-16 h-16 ${themeColors.text} animate-pulse`}
                  fill="currentColor"
                />
                <div className="absolute inset-0 w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
              <p className="text-white/70 mt-4 text-lg">
                Loading your favorites...
              </p>
            </div>
          ) : favoritesSongs.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Heart className={`w-16 h-16 ${themeColors.text}/60`} />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Music className="w-8 h-8 text-white/40 animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No favorites yet
              </h3>
              <p className="text-white/70 text-lg mb-6 max-w-md">
                Start building your collection by hearting songs you love.
                They'll appear here!
              </p>
              <div className="flex flex-col items-center gap-2 text-white/50">
                <p className="text-sm">
                  💡 Tip: Click the heart icon on any song to add it to
                  favorites
                </p>
              </div>
            </div>
          ) : (
            /* Songs List */
            favoritesSongs.map((song, id) => (
              <div
                key={song.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border hover:scale-[1.01] hover:shadow-lg ${
                  playingSongId === song.id
                    ? `bg-gradient-to-r ${theme.preview} border-white/40 shadow-lg ${themeColors.shadow}`
                    : `bg-white/10 border-white/20 ${themeColors.hoverBg} hover:border-white/30`
                } ${
                  openDropdownSongId === song.id ? "relative z-[10000]" : ""
                }`}
                onClick={() => handleSongSingleClick(song)}
                onDoubleClick={() => {
                  handleSongDoubleClick(song);
                  setPlayer(true);
                  setIsPlaying(true);
                }}
              >
                <div className="font-medium text-white drop-shadow-sm">
                  {id + 1}
                </div>
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 rounded-xl bg-white/10 hover:bg-${theme.primary}/30 border border-white/20 opacity-100 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playingSongId === song.id) {
                        setIsPlaying(!isPlaying);
                      } else {
                        handleSongDoubleClick(song);
                        setPlayer(true);
                        setIsPlaying(true);
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
                    <div className="font-medium truncate text-white drop-shadow-sm flex items-center gap-2">
                      {song.title || song.filename}
                      <Heart
                        className={`w-3 h-3 ${themeColors.text}`}
                        fill="currentColor"
                      />
                    </div>
                    <span className="text-sm text-white/70 truncate">
                      {song.artist}
                    </span>
                  </span>
                  <span className="col-span-3 text-sm text-white/70 truncate">
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
                  {openDropdownSongId === song.id && (
                    <SongOptionsDropdown
                      songId={song.id}
                      onDelete={() => {
                        removeFavorite(song.id);
                        setOpenDropdownSongId(null);
                      }}
                      onClose={() => setOpenDropdownSongId(null)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
