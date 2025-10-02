"use client";
import { Button } from "@/app/components/ui/button";
import { MoreHorizontal, Play, Heart, UserPlus } from "lucide-react";
import ProfileAvatar from "../../components/profile-avatar";
import { useSession } from "next-auth/react";
import { useTheme } from "../../utils/theme-context";
import { getGeneralThemeColors } from "../../lib/theme-colors";
import Image from "next/image";
import { useEntityContext } from "@/app/utils/entity-context";

export default function ProfilePage() {
  const { status, data: session } = useSession();
  const { theme } = useTheme();
  const { playlistList } = useEntityContext();
  const themeColors = getGeneralThemeColors(theme.primary);
  const topArtists = [
    { name: "The Weeknd", image: "/the-weeknd-artist-photo.png" },
    { name: "Billie Eilish", image: "/billie-eilish-artist-photo.png" },
    { name: "Drake", image: "/drake-artist-photo.png" },
    { name: "Taylor Swift", image: "/taylor-swift-artist-photo.png" },
    { name: "Post Malone", image: "/post-malone-artist-photo.png" },
    { name: "Ariana Grande", image: "/ariana-grande-artist-photo.png" },
    { name: "Ed Sheeran", image: "/ed-sheeran-artist-photo.png" },
  ];

  const topTracks = [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      image: "/blinding-lights-album-cover.png",
    },
    {
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: "2:58",
      image: "/good-4-u-album-cover.png",
    },
    {
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      album: "F*CK LOVE 3",
      duration: "2:21",
      image: "/stay-album-cover.png",
    },
    {
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      image: "/levitating-album-cover.png",
    },
    {
      title: "Peaches",
      artist: "Justin Bieber ft. Daniel Caesar",
      album: "Justice",
      duration: "3:18",
      image: "/peaches-album-cover.png",
    },
  ];


  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-y-auto custom-scrollbar">
      {/* Background Effects */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-r ${themeColors.gradient} opacity-10 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r ${themeColors.gradient} opacity-5 rounded-full blur-3xl animate-pulse delay-1000`}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r ${themeColors.gradient} opacity-8 rounded-full blur-3xl animate-pulse delay-500`}
        />
      </div> */}

      <div className="relative z-10 p-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-end gap-8 mb-8">
            <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <ProfileAvatar w={48} h={48} />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="flex-1">
              <p className="text-sm text-white/60 mb-2 font-medium">Profile</p>
              <h1
                className={`text-6xl font-bold mb-4 text-white bg-clip-text text-transparent`}
              >
                {session?.user?.name || "User Name"}
              </h1>
              <div className="flex items-center gap-6 text-white/80">
                <span className="font-medium">
                  {playlistList.length} Public Playlists
                </span>
                {/* <span>•</span>
                <span className="font-medium">1.2K Followers</span>
                <span>•</span>
                <span className="font-medium">847 Following</span> */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex items-center gap-4">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-full font-semibold"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Follow
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-full w-12 h-12"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div> */}
        </div>

        {/* Created Playlists */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Created Playlists</h2>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            >
              Show all
            </Button>
          </div>
          <div className="flex overflow-x-auto gap-6 custom-scrollbar pb-4">
            {playlistList.map((playlist, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white/10 w-64 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
                  <div className="relative mb-4">
                    <Image
                      src={playlist.playlistArt || "/assets/music-icon.webp"}
                      alt={playlist.name}
                      width={256}
                      height={256}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${theme.preview} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                    <Button
                      size="icon"
                      className={`absolute bottom-2 right-2 bg-gradient-to-r ${themeColors.solidBg} hover:${themeColors.gradient} text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg`}
                    >
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-white mb-1">
                    {playlist.name}
                  </h3> 
                  <p className="text-sm text-white/60">
                    {playlist.musicCount} songs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artists */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Top artists this month</h2>
              <p className="text-white/60 text-sm">Only visible to you</p>
            </div>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            >
              Show all
            </Button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {topArtists.map((artist, index) => (
              <div key={index} className="flex-shrink-0 group cursor-pointer">
                <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl w-48`}>
                  <div className="relative mb-4">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-full"
                      width={256}
                      height={256}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${theme.preview} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                  </div>
                  <h3 className="font-semibold text-white text-center">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-white/60 text-center">Artist</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tracks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Top tracks this month</h2>
              <p className="text-white/60 text-sm">Only visible to you</p>
            </div>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            >
              Show all
            </Button>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            {topTracks.map((track, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group cursor-pointer"
              >
                <span className="text-white/60 font-medium w-6 text-center group-hover:hidden">
                  {index + 1}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`w-6 h-6 hidden group-hover:flex text-white ${themeColors.hover}`}
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Image
                  src={track.image || "/placeholder.svg"}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                  width={256}
                  height={256}
                />
                <div className="flex-1">
                  <h4
                    className={`font-medium text-white group-hover:${themeColors.text} transition-colors`}
                  >
                    {track.title}
                  </h4>
                  <p className="text-sm text-white/60">{track.artist}</p>
                </div>
                <p className="text-sm text-white/60 hidden md:block">
                  {track.album}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`text-white/60 ${themeColors.hover} opacity-0 group-hover:opacity-100 transition-all duration-200`}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <span className="text-sm text-white/60 w-12 text-right">
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

