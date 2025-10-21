"use client";
import { Button } from "@/app/components/ui/button";
import {
  MoreHorizontal,
  Play,
  UserPlus,
  MicVocal,
  Globe,
  Youtube,
} from "lucide-react";
import ProfileAvatar from "../../../components/profile-avatar";
import { useTheme } from "../../../utils/theme-context";
import { getGeneralThemeColors } from "../../../lib/theme-colors";
import Image from "next/image";
import { useEntityContext } from "@/app/utils/entity-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import {
  Music,
  Github,
  Twitter,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;

export function getFullName(firstName: string, lastName: string) {
  return `${firstName?.charAt(0).toUpperCase()}${firstName?.slice(1)} ${lastName
    ?.charAt(0)
    .toUpperCase()}${lastName?.slice(1)}`;
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const entityContext = useEntityContext();
  const playlistList = Array.isArray(entityContext?.playlistList)
    ? entityContext.playlistList
    : [];
  const themeColors = getGeneralThemeColors(theme.primary);
  const [userData, setUserData] = useState<any>(null);
  const [artistData, setArtistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const cookie = Cookies.get("sonex_user");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        setUserData(parsed.User);
        console.log("User data from cookie:", parsed.User);
      } catch (err) {
        console.error("Invalid cookie data:", err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userData || !userData.profileId) return;
    const fetchArtistData = async () => {
      try {
        const res = await axios.get(
          `${USER_MANAGEMENT_SERVICE_URL}/artists?profileId=${userData.profileId}`
        );
        setArtistData(res.data);
        console.log("Artist data:", res.data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };
    fetchArtistData();
  }, [userData]);

  const backdropUrl =
    userData?.profileImageURL || "/assets/artist-backdrop.jpg";

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-orange-300 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen relative text-white overflow-y-auto custom-scrollbar">
      {/* Backdrop image with overlay */}
      <div className="absolute inset-0 h-96 w-full z-0">
        <Image
          src={backdropUrl}
          alt="Artist Backdrop"
          fill
          className="object-cover object-center w-full h-full opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent  to-slate-900" />
      </div>

      <div className="relative z-10 p-8 pt-32">
        {/* Profile Header - special for artist */}
        <div className="mb-6 flex flex-col md:flex-row items-end gap-10 md:gap-16">
          <div className="relative group -mt-32 md:mt-0">
            <div className="w-64 h-64 md:w-48 md:h-48 rounded-full overflow-hidden bg-white/10 backdrop-blur-md border-4 border-orange-400 shadow-2xl flex items-center justify-center">
              <ProfileAvatar w={48} h={48} />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-orange-500/90 px-6 py-2 rounded-full text-white font-semibold text-sm shadow-lg border-2 border-white/20">
              <MicVocal className="inline-block w-3 h-3 mr-2 -mt-1" />
              Artist
            </div> */}
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm text-orange-200 mb-1 font-semibold tracking-widest uppercase">
                Artist Profile
              </p>
              <h1 className="text-6xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-orange-300 via-orange-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                {getFullName(userData?.firstName, userData?.lastName) ||
                  "Artist Name"}
              </h1>
              <div className="flex items-center gap-8 text-white/90 text-lg font-medium mb-4">
                <span>{playlistList.length} Playlists</span>
              </div>
              {artistData?.artistBio && (
                <div className="mb-4">
                  <p className="text-white/80 text-base whitespace-pre-line">
                    {artistData.artistBio}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-baseline">
              <div className="flex flex-wrap gap-3 mb-2 justify-evenly">
                {artistData?.youtube && (
                  <a
                    href={artistData.youtube}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                    aria-label="YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
                {artistData?.twitter && (
                  <a
                    href={artistData.twitter}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                    aria-label="Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                )}
                {artistData?.instagram && (
                  <a
                    href={artistData.instagram}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {artistData?.facebook && (
                  <a
                    href={artistData.facebook}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                )}
                {artistData?.website && (
                  <a
                    href={artistData.website}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 transition-all duration-300 border border-white/20 hover:scale-110 transform"
                    aria-label="Website"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
          {/* <div className="flex items-center gap-4 mt-2">
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
      </div>
      <hr className="border-t border-white/20 my-6" />
      {/* Created Playlists or Empty Profile Insight */}
      {playlistList.length > 0 ? (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-200">
              Created Playlists
            </h2>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            >
              Show all
            </Button>
          </div>
          <div className="flex overflow-x-auto gap-6 custom-scrollbar pb-4">
            {playlistList.map(
              (playlist, index) =>
                playlist.role === 0 && (
                  <div key={index} className="group cursor-pointer">
                    <div className="bg-white/10 w-64 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
                      <div className="relative mb-4">
                        <Image
                          src={
                            playlist.playlistArt || "/assets/music-icon.webp"
                          }
                          alt={playlist.name}
                          width={256}
                          height={256}
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${themeColors.solidBg} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
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
                )
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-200/20 opacity-70 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <MicVocal className="w-12 h-12 text-orange-300" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-orange-200 mb-2">
            No artist activity yet
          </h3>
          <p className="text-orange-100/80 text-lg mb-6 max-w-md mx-16">
            You haven't created any playlists or activity yet. Start sharing
            your music and grow your audience!
          </p>
        </div>
      )}
    </div>
  );
}
