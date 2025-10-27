"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Play,
  Pause,
  ArrowLeft,
  Music2,
  Clock,
  Sparkles,
  Shuffle,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import { useSidebar } from "@/app/utils/sidebar-context";
import { useMusicContext } from "@/app/utils/music-context";
import { useTheme } from "@/app/utils/theme-context";
import { getGeneralThemeColors } from "@/app/lib/theme-colors";
import { useRouter, useSearchParams } from "next/navigation";
import { Song } from "@/app/utils/music-context";
import axios from "axios";
import Cookies from "js-cookie";
import clsx from "clsx";

const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;
const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

function SuggestedPlaylistContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "";
  const genre = searchParams.get("genre") || "";
  const playlistName = searchParams.get("name") || "Suggested Playlist";

  const [songList, setSongList] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const { player } = useSidebar();

  const {
    setSelectSong,
    setPlayingSong,
    setSelectSongId,
    setPlayingSongId,
    isPlaying,
    setIsPlaying,
    playingSong,
    setSongList: setGlobalSongList,
  } = useMusicContext();

  const { setPlayer } = useSidebar();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const sonexUserCookie = Cookies.get("sonex_token");
        const response = await axios.get(
          `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/suggestedplaylist/tracks`,
          {
            params: { mood, genre },
            withCredentials: true,
            headers: {
              ...(sonexUserCookie
                ? { Authorization: `Bearer ${sonexUserCookie}` }
                : {}),
            },
          }
        );
        setSongList(response.data);
        setFilteredSongs(response.data);
        console.log("Suggested Playlist Tracks:", response.data);
      } catch (error) {
        console.error("Error fetching suggested playlist tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mood && genre) {
      fetchTracks();
    }
  }, [mood, genre]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs(songList);
    } else {
      const filtered = songList.filter(
        (song) =>
          song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songList]);

  const handleSongClick = (song: Song) => {
    setSelectSongId(song.id);
    setSelectSong(song);
  };

  const handleSongDoubleClick = (song: Song) => {
    handleSongClick(song);
    setPlayingSongId(song.id);
    setPlayingSong(song);
    setGlobalSongList(songList);

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
    song.xscore = newScore;
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed -top-32 left-1/2 transform -translate-x-1/2 z-0">
        <div
          className="w-[1500px] h-[1000px] bg-contain bg-no-repeat bg-center opacity-20"
          style={{ backgroundImage: "url('/assets/sonex-wall.webp')" }}
        />
      </div>

      <ScrollArea className={clsx("h-full", player ? "pb-48" : "pb-24")}>
        <div className="relative z-10 p-8 pt-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 text-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          {/* Playlist Header */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex items-start gap-8">
              {/* Playlist Cover */}
              <div
                className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${getMoodGradient(
                  mood
                )} flex items-center justify-center shadow-2xl flex-shrink-0`}
              >
                <Music2 className="w-32 h-32 text-white/90" />
              </div>

              {/* Playlist Info */}
              <div className="flex-1 flex flex-col justify-between h-64">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={`w-5 h-5 ${themeColors.text}`} />
                    <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Suggested Playlist
                    </span>
                  </div>
                  <h1
                    className="text-5xl font-bold mb-4"
                    style={{ color: theme.primary }}
                  >
                    {playlistName}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-1.5 rounded-full bg-white/10 ${themeColors.text} font-semibold capitalize text-sm`}
                    >
                      {mood}
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 font-semibold capitalize text-sm">
                      {genre}
                    </span>
                  </div>
                  <p
                    className="text-white/60 text-base"
                    style={{
                      fontSize: "1.1rem",
                      opacity: 0.8,
                    }}
                  >
                    {songList.length} songs
                  </p>
                </div>

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
                      <Shuffle className="w-5 h-5 mr-2" />
                      Shuffle
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search in this playlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 h-12 pl-12 rounded-xl"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <Music2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Songs List */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-32">
            {filteredSongs.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Music2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {searchQuery ? "No songs found" : "No tracks available"}
                </p>
              </div>
            ) : (
              <>
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-white/60 text-sm font-semibold border-b border-white/10 mb-2">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">TITLE</div>
                  <div className="col-span-3">ALBUM</div>
                  <div className="col-span-2">ARTIST</div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                {/* Song Rows */}
                <div className="space-y-1">
                  {filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      className={clsx(
                        "grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 group cursor-pointer",
                        playingSong?.id === song.id && "bg-white/5"
                      )}
                      onClick={() => handleSongClick(song)}
                      onDoubleClick={() => {
                        handleSongDoubleClick(song);
                        setPlayer(true);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="col-span-1 flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-9 w-9 rounded-xl bg-white/10 ${themeColors.hoverBg} border border-white/20 opacity-100 group-hover:opacity-100 transition-all duration-300`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (playingSong?.id === song.id) {
                              setIsPlaying(!isPlaying);
                            } else {
                              handleSongDoubleClick(song);
                              setPlayer(true);
                              setIsPlaying(true);
                            }
                          }}
                        >
                          {playingSong?.id === song.id && isPlaying ? (
                            <Pause className="h-4 w-4 text-white" />
                          ) : (
                            <Play
                              className="h-4 w-4 text-white"
                              fill="currentColor"
                            />
                          )}
                        </Button>
                      </div>

                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <Music2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={clsx(
                              "font-semibold truncate",
                              playingSong?.id === song.id
                                ? themeColors.text
                                : "text-white"
                            )}
                          >
                            {song.title || song.filename}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center text-white/70 truncate">
                        {song.album || "Unknown Album"}
                      </div>

                      <div className="col-span-2 flex items-center text-white/70 truncate">
                        {song.artist || "Unknown Artist"}
                      </div>

                      <div className="col-span-1 flex items-center justify-center text-white/60">
                        {typeof song.metadata?.track_length === "number"
                          ? formatDuration(song.metadata.track_length)
                          : "--:--"}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function SuggestedPlaylistPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      }
    >
      <SuggestedPlaylistContent />
    </Suspense>
  );
}

// Helper function to get gradient based on mood
function getMoodGradient(mood: string): string {
  const moodGradients: { [key: string]: string } = {
    aggressive: "from-red-600 via-orange-600 to-yellow-500",
    calm: "from-blue-400 via-cyan-400 to-teal-300",
    happy: "from-yellow-400 via-pink-400 to-red-400",
    sad: "from-blue-900 via-indigo-800 to-purple-900",
    energetic: "from-orange-500 via-red-500 to-pink-500",
    romantic: "from-pink-500 via-rose-400 to-red-400",
    focused: "from-indigo-600 via-purple-600 to-pink-500",
    relaxed: "from-green-400 via-teal-400 to-blue-400",
  };

  return (
    moodGradients[mood.toLowerCase()] ||
    "from-purple-600 via-pink-600 to-blue-600"
  );
}
