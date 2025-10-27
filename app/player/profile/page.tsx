"use client";
import { Button } from "@/app/components/ui/button";
import { Play, UserPlus, MicVocal, SquarePen } from "lucide-react";
import ProfileAvatar from "../../components/profile-avatar";
import { useTheme } from "../../utils/theme-context";
import { getGeneralThemeColors } from "../../lib/theme-colors";
import Image from "next/image";
import { useEntityContext } from "@/app/utils/entity-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSidebar } from "../../utils/sidebar-context";

import { getFullName } from "@/app/lib/name-utils";

export default function ProfilePage() {
  const { theme } = useTheme();
  const { playlistList } = useEntityContext();
  const themeColors = getGeneralThemeColors(theme.primary);
  const [userData, setUserData] = useState<any>(null);
  const { setProfileUpdate, setCollaborators, setDetailPanel, setQueue } =
    useSidebar();
  useEffect(() => {
    const cookie = Cookies.get("sonex_user");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        console.log("Parsed cookie data:", parsed);
        setUserData(parsed);
      } catch (err) {
        console.error("Invalid cookie data:", err);
      }
    }
  }, []);

  const router = useRouter();

  return (
    <div className="h-screen relative text-white overflow-y-auto custom-scrollbar">
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
            {/* Top-right controls: Be an Artist + Edit (aligned) */}
            <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
              <Button
                className={`bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold px-6 py-3 rounded-lg text-lg hover:bg-gradient-to-br ${themeColors.gradient} hover:backdrop-blur-2xl hover:border-white/40 transition-all duration-200 flex items-center`}
                onClick={() => router.push("/player/beAnArtist")}
              >
                <MicVocal className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                <span className="hidden md:inline">Be an Artist</span>
              </Button>

              <button
                onClick={() => {
                  setProfileUpdate(true);
                  setCollaborators(false);
                  setDetailPanel(false);
                  setQueue(false);
                }}
                aria-label="Edit profile"
                className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${themeColors.gradient} transition-all duration-300 border border-white/20 hover:scale-110 transform`}
              >
                <SquarePen className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/60 mb-2 font-medium">Profile</p>
              <h1
                className={`text-6xl font-bold mb-4 text-white bg-clip-text text-transparent`}
              >
                {getFullName(userData?.firstName, userData?.lastName) ||
                  "User Name"}
              </h1>
              <div className="flex items-center gap-6 text-white/80">
                <span className="font-medium">
                  {playlistList.length} Playlists
                </span>
                {/* <span>•</span>
                <span className="font-medium">1.2K Followers</span>
                <span>•</span>
                <span className="font-medium">847 Following</span> */}
              </div>
            </div>
          </div>
          {/* Horizontal separator */}
          <hr className="border-t border-white/20 my-6" />

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

        {/* Created Playlists or Empty Profile Insight */}
        <div className="mb-12">
          {(() => {
            const visiblePlaylists = Array.isArray(playlistList)
              ? playlistList.filter((p) => p && p.role === 0)
              : [];

            if (visiblePlaylists.length > 0) {
              return (
                <>
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
                    {visiblePlaylists.map((playlist, index) => (
                      <div
                        key={playlist.id ?? index}
                        className="group cursor-pointer"
                      >
                        <div className="bg-white/10 w-64 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
                          <div className="relative mb-4">
                            <Image
                              src={
                                playlist.playlistArt ||
                                "/assets/music-icon.webp"
                              }
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
                              className={`absolute bottom-2 right-2 bg-gradient-to-r ${themeColors.solidBg} text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:opacity-90 hover:ring-2 hover:ring-white/40`}
                              onClick={() =>
                                router.push(`/player/playlist/${playlist.id}`)
                              }
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
                </>
              );
            }

            // No playlists -> generated empty state
            return (
              <div className="flex items-center justify-center py-24 px-6">
                <div className="max-w-3xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                  <div className="mx-auto mb-6 w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-red-500/10">
                    <UserPlus className="w-12 h-12 text-white/60" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No profile insight yet
                  </h3>
                  <p className="text-white/70 text-lg mb-6 max-w-md mx-auto">
                    You haven't created any playlists or activity yet. Start
                    exploring and create your first playlist or upload your
                    music to share it with listeners.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => router.push("/player/beAnArtist")}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm ${themeColors.solidBg} text-white hover:opacity-90 transition`}
                    >
                      Be an artist
                    </button>

                    <button
                      onClick={() => router.push("/player/playlist/new")}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm bg-white/5 text-white border border-white/10 hover:bg-white/10 transition"
                    >
                      Create a playlist
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        {/* Top Artists */}
        {/* <div className="mb-12">
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
        </div> */}

        {/* Top Tracks */}
        {/* <div>
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
        </div> */}
      </div>
    </div>
  );
}
