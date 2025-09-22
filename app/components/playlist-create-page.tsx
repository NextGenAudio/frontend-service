"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Search, Music, Clock, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import clsx from "clsx";
import { useSidebar } from "../utils/sidebar-context";
import AlertBar from "./alert-bar";

// Backend service URLs
const PLAYLIST_SERVICE_URL = "http://localhost:8082/playlist-service/playlists";
const MUSIC_SERVICE_URL = "http://localhost:8080/files/list";

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

interface PlaylistFormData {
  name: string;
}

export function PlaylistCreatePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const [formData, setFormData] = useState<PlaylistFormData>({ name: "" });
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  // Remove step state since we're showing everything on one page
  const [message, setMessage] = useState<string | null>(null);
  const { player } = useSidebar();
  useEffect(() => {
    fetchAvailableSongs();
  }, []);

  const fetchAvailableSongs = async () => {
    try {
      const response = await axios.get(MUSIC_SERVICE_URL, {
        withCredentials: true,
      });
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

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Create the playlist
      const playlistResponse = await axios.post(
        PLAYLIST_SERVICE_URL,
        { name: formData.name },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newPlaylist = playlistResponse.data;

      if (!newPlaylist || !newPlaylist.playlistId) {
        throw new Error("Failed to get playlist ID from the response.");
      }

      const playlistId = newPlaylist.playlistId;

      // Step 2: Add selected songs to the new playlist
      if (selectedSongs.length > 0) {
        const songIds = selectedSongs.map((song) => parseInt(song.id));

        await axios.post(
          `${PLAYLIST_SERVICE_URL}/${playlistId}/tracks`,
          { fileIds: songIds },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      setMessage("✅ Playlist created successfully!");
      setTimeout(() => {
        router.push("/player/home");
      }, 2000);
    } catch (error) {
      console.error("Failed to create playlist:", error);
      let errorMessage = "❌ Failed to create playlist. Please try again.";
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

  const resetForm = () => {
    setFormData({ name: "" });
    setSelectedSongs([]);
    setSearchQuery("");
    setMessage(null);
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

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-slate-800/80 to-gray-900/90"></div>

      <div className={clsx(`relative h-full flex flex-col ${player ? "pb-80" : "pb-44"}`)}>
        {/* Header */}

        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent pb-2`}
          >
            Create New Playlist
          </h1>
        </div>

        {/* Content */}
        <div className=" flex-1 overflow-hidden p-6">
          <div className="h-full flex gap-8">
            {/* Left Side - Inputs and Song Selection */}
            <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
              {/* Playlist Name Input */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Playlist Details
                </h2>
                <div className="space-y-4">
                  <Label
                    htmlFor="name"
                    className="text-white text-lg font-medium"
                  >
                    Playlist Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:${themeColors.border} h-12 text-lg`}
                    placeholder="My Awesome Playlist"
                    required
                  />
                </div>
              </div>

              {/* Song Selection Section */}
              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Add Songs
                </h2>

                <div className="space-y-4 h-full flex flex-col">
                  <div className="relative">
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
                          className={`flex items-center justify-between p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? `${themeColors.hoverBg} border ${themeColors.border} shadow-lg`
                              : "bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? `bg-gradient-to-r ${themeColors.gradient} scale-110`
                                  : "bg-white/10"
                              }`}
                            >
                              <Music
                                className={`w-7 h-7 ${
                                  isSelected ? "text-white" : "text-gray-400"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-lg truncate">
                                {song.title || song.filename}
                              </p>
                              <p className="text-gray-400 text-base truncate">
                                {song.artist || "Unknown Artist"}
                              </p>
                              {song.album && (
                                <p className="text-gray-500 text-sm truncate">
                                  {song.album}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 flex-shrink-0">
                            <span className="text-gray-400 text-base flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {formatDuration(song.metadata?.track_length || 0)}
                            </span>
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? `${themeColors.border} bg-gradient-to-r ${themeColors.gradient}`
                                  : `border-gray-400 ${themeColors.hover}`
                              }`}
                            >
                              {isSelected && (
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Selected Songs Output */}
            <div className="w-[450px] flex flex-col space-y-6">
              {/* Selected Songs Preview */}
              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm overflow-hidden">
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
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <Music className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg">No songs selected</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Select songs from the left to add them here
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 h-full overflow-y-auto space-y-3 pr-2">
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.name}
                  className={`w-full bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 h-12 text-base font-medium`}
                >
                  {loading ? "Creating..." : "Create Playlist"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full border-white/20 text-white hover:bg-white/10 h-12 text-base"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          {message && <AlertBar message={message} setMessage={setMessage} />}
        </div>
      </div>
    </div>
  );
}
