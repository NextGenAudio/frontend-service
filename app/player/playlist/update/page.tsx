"use client";

import type React from "react";
import { useState, useEffect} from "react";
import {
  ArrowLeft,
  Search,
  Music,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import axios from "axios";
import { useTheme } from "../../../utils/theme-context";
import { getGeneralThemeColors } from "../../../lib/theme-colors";
import clsx from "clsx";
import { useSidebar } from "../../../utils/sidebar-context";
import AlertBar from "../../../components/alert-bar";
import { useFileHandling } from "../../../utils/entity-handling-context";
import { useEntityContext } from "@/app/utils/entity-context";

// Backend service URLs
const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;
const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

interface Song {
  id: string;
  title: string | undefined;
  filename: string;
  artist: string | undefined;
  album: string | undefined;
  path: string;
  uploadedAt: Date;
  source: string;
  metadata: any;
  liked: boolean;
}

interface Playlist {
  id?: number; // from entity-context
  playlistId?: number; // for compatibility
  name: string;
  description?: string;
  coverImage?: string;
  image?: string; // for compatibility with existing code
  songCount?: number;
  createdAt?: string;
  updatedAt?: string;
  musics?: Song[]; // Add this for song data
  tracks?: Song[]; // Keep for compatibility
}

const PlaylistUpdatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Try to get playlist ID from different sources
  const playlistId =
    searchParams.get("id") || params.id || searchParams.get("playlistId");

  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const { player } = useSidebar();
  const { setPlaylistCreateRefresh } = useFileHandling();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { playlistList } = useEntityContext();

  useEffect(() => {
    console.log("PlaylistId:", playlistId); // Debug log
    console.log("Search params:", searchParams.toString()); // Debug log
    console.log("Params:", params); // Debug log

    if (playlistId) {
      fetchPlaylistData();
    } else {
      setMessage("❌ No playlist ID provided");
      setInitialLoading(false);
    }
    fetchAvailableSongs();
  }, [playlistId]);

  const fetchPlaylistData = async () => {
    try {
      console.log("Fetching playlist data for ID:", playlistId); // Debug log

      const idStr = Array.isArray(playlistId) ? playlistId[0] : playlistId;

      const playlistData = idStr
        ? playlistList.find((p) => p.id === parseInt(idStr)) || null
        : null;
      // playlistList items come from the external entity-context and may have musics typed as unknown[];
      // cast the found item to the local Playlist type and assert musics/tracks as Song[].
      const typedPlaylist = playlistData ? (playlistData as unknown as Playlist) : null;
      setPlaylist(typedPlaylist);
      setSelectedSongs(
        (typedPlaylist?.musics as Song[] | undefined) ||
          (typedPlaylist?.tracks as Song[] | undefined) ||
          []
      );
      setInitialLoading(false);
    } catch (error) {
      console.error("Failed to fetch playlist:", error);
      setMessage("❌ Failed to load playlist data");
      setInitialLoading(false);
    }
  };

  const fetchAvailableSongs = async () => {
    try {
      console.log("Fetching available songs..."); // Debug log
      const response = await axios.get(`${MUSIC_LIBRARY_SERVICE_URL}/files/list`, {
        withCredentials: true,
      });
      console.log("Available songs response:", response.data?.length, "songs"); // Debug log
      setAvailableSongs(response.data);
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      setMessage("❌ Failed to load songs");
    }
  };

  const toggleSongSelection = (song: Song) => {
    setSelectedSongs((prev) => {
      const isSelected = prev.find((s) => s.id === song.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  const handleUpdate = async () => {
    if (!playlistId) return;

    setLoading(true);
    setMessage(null);

    try {
      const songIds = selectedSongs.map((song) => parseInt(song.id));

      await axios.post(
        `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/${playlistId}/tracks`,
        { fileIds: songIds },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Songs added to playlist successfully!");
      setPlaylistCreateRefresh((old) => old + 1);
    } catch (error) {
      console.error("Failed to add songs to playlist:", error);
      let errorMessage =
        "❌ Failed to add songs to playlist. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `❌ Error: ${
          error.response.data.message || "An unknown error occurred."
        }`;
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = availableSongs.filter((song) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (song.title || song.filename)?.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query) ||
      song.album?.toLowerCase().includes(query)
    );
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (initialLoading) {
    return (
      <div className="h-screen w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-slate-800/80 to-gray-900/90"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">Loading playlist...</div>
            <div className="text-gray-400 text-sm">
              Playlist ID: {playlistId || "Not found"}
            </div>
            {message && (
              <div className="text-red-400 text-sm mt-2">{message}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-slate-800/80 to-gray-900/90"></div>

      <div
        className={clsx(
          `relative h-full flex flex-col ${player ? "pb-80" : "pb-44"}`
        )}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className={`text-3xl font-bold bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent pb-2`}
          >
            Update Playlist - {playlist?.name || "Loading..."}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 w-full overflow-hidden p-6">
          <div className="flex-1 flex flex-col h-full">
            <div className="flex gap-6 flex-1 min-h-0">
              {/* Left Side - Song Selection */}
              <div className="w-2/3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm flex flex-col min-h-0">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Available Songs
                </h2>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search songs in your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:${themeColors.border} h-12`}
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {filteredSongs.map((song) => {
                    const isSelected = selectedSongs.some(
                      (s) => s.id === song.id
                    );
                    return (
                      <div
                        key={song.id}
                        onClick={() => toggleSongSelection(song)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? `${themeColors.hoverBg} border ${themeColors.border} shadow-lg`
                            : "bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                              isSelected
                                ? `bg-gradient-to-r ${themeColors.gradient} scale-110`
                                : "bg-white/10"
                            }`}
                          >
                            <Music
                              className={`w-6 h-6 ${
                                isSelected ? "text-white" : "text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-m truncate">
                              {song.title || song.filename}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                              {song.artist || "Unknown Artist"}
                            </p>
                            {song.album && (
                              <p className="text-gray-500 text-xs truncate">
                                {song.album}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <span className="text-gray-400 text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(song.metadata?.track_length || 0)}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? `${themeColors.border} bg-gradient-to-r ${themeColors.gradient}`
                                : `border-gray-400 ${themeColors.hover}`
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Selected Songs */}
              <div className="w-1/3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Selected Songs
                  </h2>
                  <Badge
                    variant="secondary"
                    className={`${themeColors.hoverBg} ${themeColors.text} px-3 py-1 text-base`}
                  >
                    {selectedSongs.length} songs
                  </Badge>
                </div>

                {selectedSongs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center py-8">
                    <Music className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg">No songs selected</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Select songs from the left to add them here
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
                    {selectedSongs.map((song, index) => (
                      <div
                        key={song.id}
                        className={`flex items-center space-x-3 p-4 ${themeColors.hoverBg} rounded-xl border ${themeColors.border}`}
                      >
                        <div
                          className={`${themeColors.text} text-base font-medium w-8`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-base font-medium truncate">
                            {song.title || song.filename}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {song.artist || "Unknown Artist"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSongSelection(song);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                        >
                          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30">
                            <div className="w-3 h-0.5 bg-current"></div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Duration */}
                {selectedSongs.length > 0 && (
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <p className="text-gray-400 text-sm">
                      Total duration:{" "}
                      {formatDuration(
                        selectedSongs.reduce(
                          (total, song) =>
                            total + (song.metadata?.track_length || 0),
                          0
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {message && <AlertBar message={message} setMessage={setMessage} />}
        </div>

        {/* Navigation - Fixed at bottom */}
        <div className="p-6 pt-0">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-white/20 text-white hover:bg-white/10 px-6 py-3 text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlist
            </Button>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-white/20 text-white hover:bg-white/10 px-6 py-3 text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className={`bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 px-8 py-3 text-base font-medium`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Adding Songs..." : "Add Songs"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistUpdatePage;
