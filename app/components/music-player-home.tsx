"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Heart,
  Clock,
  TrendingUp,
  Headphones,
  Music,
  Shuffle,
  SkipForward,
} from "lucide-react";

export function MusicPlayerHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const recentlyPlayed = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "/blinding-lights-album-cover.png",
      duration: "3:20",
    },
    {
      id: 2,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      image: "/watermelon-sugar-album-cover.png",
      duration: "2:54",
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
      image: "/levitating-album-cover.png",
      duration: "3:23",
    },
    {
      id: 4,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      image: "/good-4-u-album-cover.png",
      duration: "2:58",
    },
    {
      id: 5,
      title: "Stay",
      artist: "The Kid LAROI",
      image: "/stay-album-cover.png",
      duration: "2:21",
    },
  ];

  const moodPlaylists = [
    {
      id: 1,
      name: "Chill Vibes",
      description: "Relax and unwind",
      songs: 42,
      color: "from-orange-500/20 to-amber-500/20",
    },
    {
      id: 2,
      name: "Workout Energy",
      description: "High energy beats",
      songs: 38,
      color: "from-orange-600/20 to-red-500/20",
    },
    {
      id: 3,
      name: "Focus Flow",
      description: "Deep concentration",
      songs: 29,
      color: "from-amber-500/20 to-orange-400/20",
    },
    {
      id: 4,
      name: "Night Drive",
      description: "Late night cruising",
      songs: 35,
      color: "from-orange-400/20 to-yellow-500/20",
    },
  ];

  const topCharts = [
    {
      rank: 1,
      title: "As It Was",
      artist: "Harry Styles",
      plays: "2.1M",
      trend: "up",
    },
    {
      rank: 2,
      title: "Heat Waves",
      artist: "Glass Animals",
      plays: "1.8M",
      trend: "up",
    },
    {
      rank: 3,
      title: "Bad Habit",
      artist: "Steve Lacy",
      plays: "1.6M",
      trend: "down",
    },
    {
      rank: 4,
      title: "About Damn Time",
      artist: "Lizzo",
      plays: "1.4M",
      trend: "up",
    },
    {
      rank: 5,
      title: "Running Up That Hill",
      artist: "Kate Bush",
      plays: "1.2M",
      trend: "up",
    },
  ];

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
      <div className="fixed -top-32 left-1/2 transform -translate-x-1/2 z-0">
        <div
          className="w-[1500px] h-[1000px] bg-contain bg-no-repeat bg-center opacity-80"
          style={{ backgroundImage: "url('/assets/sonex-wall.png')" }}
        />
      </div>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-amber-500/10 to-orange-600/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-orange-400/10 to-yellow-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-8 pt-96 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                  {getGreeting()}
                </h1>
                <p className="text-white/80 text-lg mt-2">
                  Ready to discover your next favorite song?
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full shadow-lg">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Animated Sound Waves */}
            <div className="flex items-center justify-center space-x-2 mb-6 h-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-orange-500 to-amber-400 rounded-full animate-pulse"
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
                  <Music className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">1,247</p>
                    <p className="text-white/70 text-sm">Songs Played</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">42h</p>
                    <p className="text-white/70 text-sm">This Week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-orange-400" />
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
            <h2 className="text-2xl font-bold text-white">Recently Played</h2>
            <button className="text-orange-400 hover:text-orange-300 transition-colors">
              View All
            </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {recentlyPlayed.map((track) => (
              <div
                key={track.id}
                className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                onMouseEnter={() => setActiveCard(track.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="relative mb-4">
                  <img
                    src={track.image || "/placeholder.svg"}
                    alt={track.title}
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center transition-opacity duration-300 ${
                      activeCard === track.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-white truncate">
                  {track.title}
                </h3>
                <p className="text-white/70 text-sm truncate">{track.artist}</p>
                <p className="text-white/50 text-xs mt-1">{track.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Playlists */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Made For You</h2>
            <button className="text-orange-400 hover:text-orange-300 transition-colors">
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {moodPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className={`bg-gradient-to-br ${playlist.color} backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {playlist.name}
                    </h3>
                    <p className="text-white/70">{playlist.description}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3 group-hover:bg-orange-500 transition-colors duration-300">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-white/60 text-sm">{playlist.songs} songs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Charts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Top Charts</h2>
            <button className="text-orange-400 hover:text-orange-300 transition-colors">
              See More
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="space-y-4">
              {topCharts.map((track) => (
                <div
                  key={track.rank}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-bold text-sm">
                    {track.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{track.title}</h4>
                    <p className="text-white/70 text-sm">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp
                      className={`w-4 h-4 ${
                        track.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}
                    />
                    <span className="text-white/60 text-sm">{track.plays}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg">
            <Shuffle className="w-8 h-8 text-white mb-2" />
            <p className="text-white font-semibold">Shuffle Play</p>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <Heart className="w-8 h-8 text-orange-400 mb-2" />
            <p className="text-white font-semibold">Liked Songs</p>
          </button>
          <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <SkipForward className="w-8 h-8 text-orange-400 mb-2" />
            <p className="text-white font-semibold">Queue</p>
          </button>
        </div>
      </div>
    </div>
  );
}
