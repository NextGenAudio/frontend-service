"use client";

import { useState, useEffect } from "react";
import ReactStars from "react-stars";
import {
  Play,
  Heart,
  Clock,
  TrendingUp,
  Headphones,
  Music,
  Shuffle,
  SkipForward,
  Star,
  History,
} from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import Image from "next/image";
import axios from "axios";
import { Song } from "../utils/music-context";
import { useSidebar } from "../utils/sidebar-context";
import { useMusicContext } from "../utils/music-context";
import clsx from "clsx";
const MUSIC_SERVICE_URL = "http://localhost:8080";

export function MusicPlayerHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const [recentMusics, setRecentMusics] = useState<Song[]>([]);
  const [trendingMusics, setTrendingMusics] = useState<Song[]>([]);
  const [mostPlayedMusics, setMostPlayedMusics] = useState<Song[]>([]);
  const { setDetailPanel, player } = useSidebar();
  const {
    setSelectSong,
    setPlayingSong,
    setSelectSongId,
    setPlayingSongId,
    setIsPlaying,
    setSongList,
  } = useMusicContext();

  const { setPlayer } = useSidebar();
  useEffect(() => {
    const fetchRecentMusics = async () => {
      try {
        const response = await axios.get(`${MUSIC_SERVICE_URL}/files/recent`, {
          withCredentials: true,
        });
        setRecentMusics(response.data);
        console.log("Recent Musics:", response.data);
      } catch (error) {
        console.error("Error fetching recent musics:", error);
      }
    };

    const fetchTrendingMusics = async () => {
      try {
        const response = await axios.get(
          `${MUSIC_SERVICE_URL}/files/trending`,
          {
            withCredentials: true,
          }
        );
        setTrendingMusics(response.data);
        console.log("Trending Musics:", response.data);
      } catch (error) {
        console.error("Error fetching trending musics:", error);
        // Fallback to recent if trending endpoint doesn't exist
        try {
          const fallbackResponse = await axios.get(
            `${MUSIC_SERVICE_URL}/files/recent`,
            {
              withCredentials: true,
            }
          );
          setTrendingMusics(fallbackResponse.data.slice(0, 8)); // Show top 8
        } catch (fallbackError) {
          console.error("Error fetching fallback data:", fallbackError);
        }
      }
    };

    const fetchMostPlayedMusics = async () => {
      try {
        const response = await axios.get(
          `${MUSIC_SERVICE_URL}/files/most-played`,
          {
            withCredentials: true,
          }
        );
        setMostPlayedMusics(response.data);
        console.log("Most Played Musics:", response.data);
      } catch (error) {
        console.error("Error fetching most played musics:", error);
        // Fallback to recent if most-played endpoint doesn't exist
        try {
          const fallbackResponse = await axios.get(
            `${MUSIC_SERVICE_URL}/files/recent`,
            {
              withCredentials: true,
            }
          );
          setMostPlayedMusics(fallbackResponse.data.slice(0, 6)); // Show top 6
        } catch (fallbackError) {
          console.error("Error fetching fallback data:", fallbackError);
        }
      }
    };

    fetchRecentMusics();
    fetchTrendingMusics();
    fetchMostPlayedMusics();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute for greeting

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const handleSongSingleClick = (song: Song) => {
    setSelectSongId(song.id);
    setSelectSong(song);
    // setDetailPanel(true);
  };
  const handleSongDoubleClick = (song: Song) => {
    // First call single click to set selection and detail panel
    handleSongSingleClick(song);

    // Set the playing song
    setPlayingSongId(song.id);
    setPlayingSong(song);

    // Update the song list with the current context (recent, trending, or most played)
    // This ensures proper next/previous functionality
    const currentList = getCurrentSongList(song);
    setSongList(currentList);

    const newScore = (song?.xscore ?? 0) + 1;
    fetch(`http://localhost:8080/files/${song.id}/score?score=${newScore}`, {
      method: "POST",
      credentials: "include",
    }).catch((err) => console.error("Failed to update song score", err));
  };

  // Helper function to determine which song list the current song belongs to
  const getCurrentSongList = (song: Song): Song[] => {
    // Check if song is in recent musics
    if (recentMusics.length > 0 && recentMusics.some((s) => s.id === song.id)) {
      return recentMusics;
    }
    // Check if song is in trending musics
    if (
      trendingMusics.length > 0 &&
      trendingMusics.some((s) => s.id === song.id)
    ) {
      return trendingMusics;
    }
    // Check if song is in most played musics
    if (
      mostPlayedMusics.length > 0 &&
      mostPlayedMusics.some((s) => s.id === song.id)
    ) {
      return mostPlayedMusics;
    }
    // Fallback to all combined songs
    const allSongs = [...recentMusics, ...trendingMusics, ...mostPlayedMusics];
    return allSongs.length > 0 ? allSongs : [song]; // At minimum, include the current song
  };

  const handleShufflePlay = () => {
    const allSongs = [...recentMusics, ...trendingMusics, ...mostPlayedMusics];
    if (allSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      const randomSong = allSongs[randomIndex];
      handleSongDoubleClick(randomSong);
      setPlayer(true);
      setIsPlaying(true);
    }
  };
  const moodPlaylists = [
    {
      id: 1,
      name: "Chill Vibes",
      description: "Relax and unwind",
      songs: 42,
      color: themeColors.gradient,
    },
    {
      id: 2,
      name: "Workout Energy",
      description: "High energy beats",
      songs: 38,
      color: themeColors.gradient,
    },
    {
      id: 3,
      name: "Focus Flow",
      description: "Deep concentration",
      songs: 29,
      color: themeColors.gradient,
    },
    {
      id: 4,
      name: "Night Drive",
      description: "Late night cruising",
      songs: 35,
      color: themeColors.gradient,
    },
  ];

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
      <div className="fixed -top-32 left-1/2 transform -translate-x-1/2 z-0">
        <div
          className="w-[1500px] h-[1000px] bg-contain bg-no-repeat bg-center opacity-90"
          style={{ backgroundImage: "url('/assets/sonex-wall.webp')" }}
        />
      </div>
      {/* Animated Background Elements */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-32 h-32 bg-gradient-to-r ${themeColors.gradient} opacity-10 rounded-full blur-xl animate-pulse`}
        ></div>
        <div
          className={`absolute top-40 right-20 w-24 h-24 bg-gradient-to-r ${themeColors.gradient} opacity-10 rounded-full blur-lg animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r ${themeColors.gradient} opacity-10 rounded-full blur-2xl animate-pulse delay-2000`}
        ></div>
      </div> */}

      <div className="relative z-10 p-8 pt-96 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className={`text-4xl font-bold bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent pb-2`}
                >
                  {getGreeting()}
                </h1>
                <p className="text-white/80 text-lg">
                  Ready to discover your next favorite song?
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className={`bg-gradient-to-r ${theme.preview} p-4 rounded-full shadow-lg`}
                >
                  <Headphones className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Animated Sound Waves */}
            <div className="flex items-center justify-center space-x-2 mb-6 h-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-t from-white to-slate-200 rounded-full animate-pulse`}
                  style={{
                    width: "4px",
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "1.5s",
                  }}
                ></div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Music className={`w-6 h-6 ${themeColors.text}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">1,247</p>
                    <p className="text-white/70 text-sm">Songs Played</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Clock className={`w-6 h-6 ${themeColors.text}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">42h</p>
                    <p className="text-white/70 text-sm">This Week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Heart className={`w-6 h-6 ${themeColors.text}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">89</p>
                    <p className="text-white/70 text-sm">Favorites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <History className={`w-6 h-6 ${themeColors.text}`} />
              Recently Played
            </h2>
            <button
              className={`${themeColors.text} ${themeColors.hover} transition-colors`}
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {recentMusics.map((track) => (
              <div
                key={track.id}
                className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                onMouseEnter={() => setActiveCard(Number(track.id))}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => handleSongSingleClick(track)}
              >
                <div className="relative mb-4">
                  <Image
                    src={
                      track.musicArt ||
                      track.metadata?.cover_art ||
                      "/placeholder.svg"
                    }
                    alt={track.filename}
                    className="w-full aspect-square rounded-xl object-cover"
                    width={256}
                    height={256}
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center transition-opacity duration-300 ${
                      activeCard === Number(track.id)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Play
                      className="w-8 h-8 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongDoubleClick(track);
                        setPlayer(true);
                        setIsPlaying(true);
                      }}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-white truncate">
                  {track.title}
                </h3>
                <p className="text-white/70 text-sm truncate">{track.artist}</p>
                <p className="text-white/50 text-xs mt-1">
                  {track.metadata?.track_length}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Musics */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp className={`w-6 h-6 ${themeColors.text}`} />
              Trending Now
            </h2>
            <button
              className={`${themeColors.text} ${themeColors.hover} transition-colors`}
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {trendingMusics.slice(0, 8).map((track, index) => (
              <div
                key={track.id}
                className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer relative"
                onMouseEnter={() => setActiveCard(Number(track.id))}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => handleSongSingleClick(track)}
              >
                {/* Trending Badge */}
                <div
                  className={`absolute -top-2 -right-2 z-10 bg-gradient-to-r ${themeColors.gradient} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}
                >
                  #{index + 1}
                </div>

                <div className="relative mb-4">
                  <Image
                    src={
                      track.musicArt ||
                      track.metadata?.cover_art ||
                      "/placeholder.svg"
                    }
                    alt={track.filename}
                    className="w-full aspect-square rounded-xl object-cover"
                    width={256}
                    height={256}
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center transition-opacity duration-300 ${
                      activeCard === Number(track.id)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Play
                      className="w-8 h-8 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongDoubleClick(track);
                        setPlayer(true);
                        setIsPlaying(true);
                      }}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-white truncate">
                  {track.title}
                </h3>
                <p className="text-white/70 text-sm truncate">{track.artist}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <ReactStars
                      count={5}
                      value={track.yscore || 0}
                      size={18}
                      color1="#6b7280"
                      color2="#fbbf24"
                      edit={false}
                      half={true}
                    />
                    <span className="text-xs text-white/60 ml-1">
                      ({track.yscore?.toFixed(1) || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">
                      {track.xscore || Math.floor(Math.random() * 1000) + 100}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Played */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Headphones className={`w-6 h-6 ${themeColors.text}`} />
              Most Played
            </h2>
            <button
              className={`${themeColors.text} ${themeColors.hover} transition-colors`}
            >
              View All
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="space-y-3">
              {mostPlayedMusics.slice(0, 6).map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleSongSingleClick(track)}
                >
                  {/* Rank */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${themeColors.gradient} rounded-full text-white font-bold text-sm shadow-lg`}
                  >
                    {index + 1}
                  </div>

                  {/* Album Art */}
                  <div className="relative">
                    <Image
                      src={
                        track.musicArt ||
                        track.metadata?.cover_art ||
                        "/placeholder.svg"
                      }
                      alt={track.filename}
                      className="w-12 h-12 rounded-lg object-cover"
                      width={48}
                      height={48}
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play
                        className="w-4 h-4 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSongDoubleClick(track);
                          setPlayer(true);
                          setIsPlaying(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {track.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-white/70 text-sm truncate">
                        {track.artist}
                      </p>
                      <ReactStars
                        count={5}
                        value={track.yscore || 0}
                        size={15}
                        color1="#6b7280"
                        color2="#fbbf24"
                        edit={false}
                        half={true}
                      />
                      <span className="text-xs text-white/50">
                        ({(track.yscore || 0).toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* Play Count */}
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm font-medium">
                      {track.listenCount || 0}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="text-white/50 text-sm">
                    {track.metadata?.track_length
                      ? `${Math.floor(track.metadata.track_length / 60)}:${
                          Math.floor(track.metadata.track_length % 60) < 10
                            ? "0" + Math.floor(track.metadata.track_length % 60)
                            : Math.floor(track.metadata.track_length % 60)
                        }`
                      : "3:24"}
                  </div>

                  {/* Play Button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongDoubleClick(track);
                        setPlayer(true);
                        setIsPlaying(true);
                      }}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${themeColors.gradient} flex items-center justify-center hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Play
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mood Playlists */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Made For You</h2>
            <button
              className={`${themeColors.text} ${themeColors.hover} transition-colors`}
            >
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {moodPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className={`bg-gradient-to-br ${playlist.color} backdrop-blur-xl border border-white/20 rounded-2xl p-6  transition-all duration-300 cursor-pointer group`}
                style={{ opacity: 0.8 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {playlist.name}
                    </h3>
                    <p className="text-white/70">{playlist.description}</p>
                  </div>
                  <div
                    className={`bg-white/20 backdrop-blur-md rounded-full p-3 group-hover:bg-gradient-to-r group-hover:${theme.preview} transition-colors duration-300`}
                  >
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-white/60 text-sm">{playlist.songs} songs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className={clsx(
            `grid grid-cols-3 gap-4 ${player ? "pb-96" : "pb-64"}`
          )}
        >
          <button
            className={`bg-gradient-to-r ${theme.preview} backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg`}
            onClick={handleShufflePlay}
          >
            <Shuffle className="w-8 h-8 text-white mb-2" />
            <p className="text-white font-semibold">Shuffle Play</p>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <Heart className={`w-8 h-8 ${themeColors.text} mb-2`} />
            <p className="text-white font-semibold">Liked Songs</p>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <SkipForward className={`w-8 h-8 ${themeColors.text} mb-2`} />
            <p className="text-white font-semibold">Queue</p>
          </button>
        </div>
      </div>
    </div>
  );
}
