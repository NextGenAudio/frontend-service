"use client";

import { useState, useEffect } from "react";
import { Play, Sparkles, Music2 } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { useRouter } from "next/navigation";
import axios from "axios";

const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;

interface SuggestedPlaylist {
  playlistName: string;
  mood: string;
  genre: string;
}

export function SuggestedPlaylists() {
  const [suggestedPlaylists, setSuggestedPlaylists] = useState<
    SuggestedPlaylist[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestedPlaylists = async () => {
      try {
        const response = await axios.get(
          `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/suggestedplaylist`,
          {
            withCredentials: true,
          }
        );
        setSuggestedPlaylists(response.data);
        console.log("Suggested Playlists:", response.data);
      } catch (error) {
        console.error("Error fetching suggested playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedPlaylists();
  }, []);

  const handlePlaylistClick = (playlist: SuggestedPlaylist) => {
    // Navigate to the suggested playlist tracks page with mood and genre as query params
    router.push(
      `/player/suggested-playlist?mood=${encodeURIComponent(
        playlist.mood
      )}&genre=${encodeURIComponent(playlist.genre)}&name=${encodeURIComponent(
        playlist.playlistName
      )}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (suggestedPlaylists.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className={`w-6 h-6 ${themeColors.text}`} />
          Suggested For You
        </h2>
        <button
          className={`${themeColors.text} ${themeColors.hover} transition-colors text-sm`}
        >
          See All
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {suggestedPlaylists.map((playlist, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            onMouseEnter={() => setActiveCard(index)}
            onMouseLeave={() => setActiveCard(null)}
            onClick={() => handlePlaylistClick(playlist)}
          >
            <div className="relative mb-4">
              {/* Dynamic gradient based on mood */}
              <div
                className={`w-full aspect-square rounded-xl bg-gradient-to-br ${getMoodGradient(
                  playlist.mood
                )} flex items-center justify-center relative overflow-hidden`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Music icon */}
                <Music2 className="w-16 h-16 text-white/90 z-10" />
                
                {/* Play button overlay */}
                <div
                  className={`absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center transition-opacity duration-300 ${
                    activeCard === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className={`bg-gradient-to-r ${themeColors.gradient} p-4 rounded-full shadow-2xl hover:scale-110 transition-transform`}
                  >
                    <Play className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Genre badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                  <span className="text-xs font-semibold text-white capitalize">
                    {playlist.genre}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white truncate mb-1">
                {playlist.playlistName}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full bg-white/10 ${themeColors.text} capitalize`}
                >
                  {playlist.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get gradient based on mood
function getMoodGradient(mood: string): string {
  const moodGradients: { [key: string]: string } = {
    aggressive: "from-red-600 via-orange-600 to-yellow-500",
    happy: "from-yellow-400 via-pink-400 to-red-400",
    sad: "from-blue-900 via-indigo-800 to-purple-900",
    dramatic: "from-orange-500 via-red-500 to-pink-500",
    relax: "from-green-400 via-teal-400 to-blue-400",
  };

  return (
    moodGradients[mood.toLowerCase()] ||
    "from-purple-600 via-pink-600 to-blue-600"
  );
}
