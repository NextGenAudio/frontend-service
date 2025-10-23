"use client";
import { Button } from "@/app/components/ui/button";
import {
  MoreHorizontal,
  Play,
  UserPlus,
  MicVocal,
  Globe,
  Youtube,
  SquarePen,
  User,
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
import { Edit3 } from "lucide-react";
import { useSidebar } from "@/app/utils/sidebar-context";

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;
const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;

export function getFullName(firstName: string, lastName: string) {
  return `${firstName?.charAt(0).toUpperCase()}${firstName?.slice(1)} ${lastName
    ?.charAt(0)
    .toUpperCase()}${lastName?.slice(1)}`;
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const entityContext = useEntityContext();
  const { setProfileUpdate, setCollaborators, setDetailPanel, setQueue } =
    useSidebar();
  const playlistList = Array.isArray(entityContext?.playlistList)
    ? entityContext.playlistList
    : [];
  const themeColors = getGeneralThemeColors(theme.primary);
  const [userData, setUserData] = useState<any>(null);
  const [artistData, setArtistData] = useState<any>(null);
  const [publishedSongs, setPublishedSongs] = useState<any[]>([]);
  const [bioOpen, setBioOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cookie = Cookies.get("sonex_user");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        setUserData(parsed);
        console.log("User data from cookie:", parsed.User);
      } catch (err) {
        console.error("Invalid cookie data:", err);
      }
    }
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
    artistData?.artistImageURL || "/assets/artist-backdrop.jpg";

  // Fetch published songs for this artist
  useEffect(() => {
    if (!artistData || !artistData.artistId) return;
    const fetchPublishedSongs = async () => {
      try {
        const sonexUserCookie = Cookies.get("sonex_token");
        const authHeader = sonexUserCookie
          ? { Authorization: `Bearer ${sonexUserCookie}` }
          : {};
        const res = await axios.get(
          `${MUSIC_LIBRARY_SERVICE_URL}/public/music/artist/${artistData.artistId}`,
          { headers: { ...authHeader } }
        );
        setPublishedSongs(res.data);
        console.log("Published songs:", res.data);
      } catch (error) {
        console.error("Error fetching published songs:", error);
      }
    };
    fetchPublishedSongs();
    setLoading(false);
  }, [artistData?.artistId]);

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
        <div className="mb-6 flex flex-col md:flex-row items-end gap-10 md:gap-16 relative">
          <div className="relative group -mt-32 md:mt-0">
            <div
              className={`w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-white/10 backdrop-blur-md border-4 border-${themeColors.border} shadow-2xl flex items-center justify-center`}
            >
              {userData?.profileImageURL ? (
                <Image
                  src={userData.profileImageURL}
                  alt="Profile Photo"
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <ProfileAvatar w={48} h={48} />
              )}
            </div>
            {/* <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/30 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
            {/* <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-orange-500/90 px-6 py-2 rounded-full text-white font-semibold text-sm shadow-lg border-2 border-white/20">
                <MicVocal className="inline-block w-3 h-3 mr-2 -mt-1" />
                Artist
              </div> */}
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Top-right edit button (separate from social icons at bottom-right) */}
            <div className="absolute right-4 top-4 z-30">
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
              <p className="text-sm  mb-1 font-semibold tracking-widest uppercase">
                Artist Profile
              </p>
              <h1
                className={`text-6xl md:text-6xl font-extrabold pb-4 bg-clip-text text-transparent drop-shadow-lg bg-gradient-to-r ${themeColors.gradientText}`}
              >
                {artistData?.artistName || "Artist Name"}
              </h1>
              <div className="flex items-center gap-3 text-white/90 text-lg font-medium mb-4">
                <span>
                  {getFullName(userData?.firstName, userData?.lastName)}
                </span>
                <span className="text-white/60">•</span>
                <span>{playlistList.length} Playlists</span>
              </div>
              {artistData?.artistBio && (
                <>
                  <div className="mb-4">
                    <button
                      onClick={() => setBioOpen(true)}
                      className={`px-3 py-2 bg-white/5 backdrop-blur-md rounded-md text-sm text-white/90 hover:bg-white/10 transition ${themeColors.solidBg}`}
                    >
                      Bio
                    </button>
                  </div>

                  {bioOpen && (
                    <div className="mt-4 max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg relative transition-opacity duration-300 opacity-100">
                      <button
                        onClick={() => setBioOpen(false)}
                        aria-label="Close bio"
                        className="absolute top-3 right-3 text-white/70 hover:text-white text-sm"
                      >
                        Close
                      </button>
                      <p className="text-white/80 text-base whitespace-pre-line">
                        {artistData.artistBio}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col items-baseline">
              <div className="absolute right-0 bottom-0 flex flex-wrap gap-3 mb-2 justify-end md:justify-evenly z-20">
                {artistData?.youtube && (
                  <a
                    href={artistData.youtube}
                    className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${themeColors.gradient} transition-all duration-300 border border-white/20 hover:scale-110 transform`}
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
                    className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${themeColors.gradient} transition-all duration-300 border border-white/20 hover:scale-110 transform`}
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
                    className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${themeColors.gradient} transition-all duration-300 border border-white/20 hover:scale-110 transform`}
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
                    className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${themeColors.gradient} transition-all duration-300 border border-white/20 hover:scale-110 transform`}
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
                    className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-gradient-to-br ${themeColors.gradient} transition-all duration-300 border border-white/20 hover:scale-110 transform`}
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
        </div>
      </div>
      <hr className="border-t border-white/20 my-6" />
      {loading ? (
        /* Loading State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-16 h-16">
            <User
              className={`w-8 h-8 ${themeColors.text} animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            />
            <div
              className={`w-16 h-16 border-4 ${themeColors.border} border-t-current rounded-full animate-spin`}
            />
          </div>
          <p className="text-white/70 mt-4 text-lg">Loading songs...</p>
        </div>
      ) : (
        <div className="relative z-10 p-8 pt-0 max-w-6xl mx-auto">
          {/* Published Songs Section */}
          <div className="mb-12">
            {publishedSongs.length > 0 || playlistList.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${themeColors.text}`}>
                    Published Songs
                  </h2>
                </div>
                <div className="flex overflow-x-auto gap-6 custom-scrollbar pb-4">
                  {publishedSongs.map((song, idx) => (
                    <div key={song.id || idx} className="group cursor-pointer">
                      <div className="bg-white/10 w-64 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
                        <div className="relative mb-4">
                          <Image
                            src={
                              song.music.artworkURL ||
                              song.music.metadata.cover_art ||
                              "/assets/music-icon.webp"
                            }
                            alt={song.music.title || "Song"}
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
                            // onClick={() => {}}
                            disabled
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-white mb-1">
                          {song.music.title ||
                            song.music.filename ||
                            "Untitled"}
                        </h3>
                        <p className="text-sm text-white/60">
                          {song.artistName || "Artist"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Created Playlists or Empty Profile Insight */}

                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${themeColors.text}`}>
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
                                    playlist.playlistArt ||
                                    "/assets/music-icon.webp"
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
                                    router.push(
                                      `/player/playlist/${playlist.id}`
                                    )
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6">
                  <div
                    className={`w-24 h-24 rounded-full ${themeColors.solidBg}/20 opacity-70 backdrop-blur-sm ${themeColors.border} flex items-center justify-center`}
                  >
                    <MicVocal className={`text-white w-12 h-12`} />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold text-white mb-2`}>
                  No artist activity yet
                </h3>
                <p
                  className={`text-white/75 text-opacity-80 text-lg mb-6 max-w-md mx-16`}
                >
                  You haven't created any playlists or activity yet. Start
                  sharing your music and grow your audience!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
