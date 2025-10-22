"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useSidebar } from "../utils/sidebar-context";
import { Upload, X, Save, UserRoundPen } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { Button } from "./ui/button";
import { set } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import clsx from "clsx";

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;

interface ProfileData {
  artistName: string;
  artistGenre: string;
  firstName: string;
  lastName: string;
  email: string;
  artistBio: string;
  location: string;
  website: string;
  instagram: string;
  youtube: string;
  spotify: string;
}

export function ProfileUpdatePanel({
  profile,
  artists,
}: {
  profile?: any;
  artists?: any;
}) {
  const { setProfileUpdate, player } = useSidebar();

  const [userData, setUserData] = useState<any>(null);
  const [artistData, setArtistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backdropImage, setBackdropImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isBackdropDragging, setIsBackdropDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backdropFileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    artistName: "",
    artistGenre: "",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    artistBio: "Music lover and artist",
    location: "New York, USA",
    website: "https://example.com",
    instagram: "@johndoe",
    youtube: "@johndoe",
    spotify: "spotify:user:johndoe",
  });
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
      setProfileImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const cookie = Cookies.get("sonex_user");
    let userDataTemp: any;
    if (cookie) {
      userDataTemp = JSON.parse(cookie);
      setUserData(userDataTemp);
      setFormData(userDataTemp);
    }
    if (userDataTemp.role?.roleName === "artist") {
      const fetchArtistData = async () => {
        try {
          const res = await axios.get(
            `${USER_MANAGEMENT_SERVICE_URL}/artists?profileId=${userDataTemp.profileId}`
          );
          setArtistData(res.data);
          setFormData((prev) => ({
            ...prev,
            artistName: res.data.artistName || "",
            artistGenre: res.data.artistGenre || "",
            artistBio: res.data.artistBio || "",
            website: res.data.website || "",
            spotify: res.data.spotify || "",
          }));
          console.log("Artist data:", res.data);
        } catch (error) {
          console.error("Error fetching artist data:", error);
        }
      };
      fetchArtistData();
    }
  }, []);

  // initialize preview images from fetched data
  useEffect(() => {
    if (userData?.profileImageURL) setProfileImage(userData.profileImageURL);
    if (artistData) {
      const backdropCandidate =
        artistData.backdrop ||
        artistData.backdropUrl ||
        artistData.cover ||
        null;
      if (backdropCandidate) setBackdropImage(backdropCandidate);
    }
  }, [userData, artistData]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const handleBackdropDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsBackdropDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBackdropImage(ev.target?.result as string);
        setBackdropFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleBackdropSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBackdropImage(ev.target?.result as string);
        setBackdropFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userPayload = new FormData();
      const artistPayload = new FormData();
      // identifiers
      if (userData?.profileId)
        userPayload.append("profileId", String(userData.profileId));
      // basic fields
      userPayload.append("firstName", formData.firstName || "");
      userPayload.append("lastName", formData.lastName || "");
      userPayload.append("email", formData.email || "");

      // append files when present
      if (profileImageFile) {
        userPayload.append("profileImage", profileImageFile);
      }

      // Get JWT from cookie (replace 'sonex_user' with your actual JWT cookie name if different)
      const sonexUserCookie = Cookies.get("sonex_token");
      console.log("JWT Token:", sonexUserCookie);
      const authHeader = sonexUserCookie
        ? { Authorization: `Bearer ${sonexUserCookie}` }
        : {};

      const userUpdateResponse = await axios.put(
        `${USER_MANAGEMENT_SERVICE_URL}/sonex/v1/auth/update-profile`,
        userPayload,
        {
          headers: { "Content-Type": "multipart/form-data", ...authHeader },
          withCredentials: true,
        }
      );

      if (userData?.role?.roleName === "artist") {
        artistPayload.append("artistName", formData.artistName || "");
        artistPayload.append("genre", formData.artistGenre || "");
        artistPayload.append("artistBio", formData.artistBio || "");
        artistPayload.append("website", formData.website || "");
        artistPayload.append("instagram", formData.instagram || "");
        artistPayload.append("youtube", formData.youtube || "");
        artistPayload.append("spotify", formData.spotify || "");
        if (backdropFile) {
          artistPayload.append("artistImage", backdropFile);
        }
        await axios.put(
          `${USER_MANAGEMENT_SERVICE_URL}/artists?profileId=${userData?.profileId}`,
          artistPayload,
          {
            headers: { "Content-Type": "multipart/form-data", ...authHeader },
            withCredentials: true,
          }
        );
      }

      if (userData) {
        const updatedUser = {
          ...userData,
          firstName: userUpdateResponse.data.firstName,
          lastName: userUpdateResponse.data.lastName,
          profileImageURL: userUpdateResponse.data.profileImageURL,
          // update artist fields if artist
        };
        Cookies.set("sonex_user", JSON.stringify(updatedUser), { expires: 7 });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }

    setIsSaving(false);
  };

  return (
    <div
      className={clsx(
        `h-screen overflow-y-auto bg-slate-900/50 backdrop-blur-xl flex flex-col ${
          player ? "pb-60" : "pb-20"
        }`
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-3 border py-2 border-white/20 shadow-lg">
        <UserRoundPen className={`w-6 h-6 ${themeColors.text}`} />
        <h2 className="text-lg font-semibold text-white/90 flex items-center">
          Edit Profile
          {/* <span className="text-2xl text-white/60 font-normal ml-2">|</span>
          <span className="text-sm text-white/60 font-normal ml-2">
            {profile?.firstName} {profile?.lastName}
          </span> */}
        </h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setProfileUpdate(false)}
          className="h-8 w-8 rounded-xl bg-white/10 hover:bg-red-500/20 border border-white/20 text-white/70 hover:text-red-400 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Backdrop Upload (artists only) */}
        {userData?.role?.roleName === "artist" && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/90">
              Backdrop
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsBackdropDragging(true);
              }}
              onDragLeave={() => setIsBackdropDragging(false)}
              onDrop={handleBackdropDrop}
              className={`relative w-full h-40 rounded-lg border-2 border-dashed transition-all duration-300 overflow-hidden ${
                isBackdropDragging
                  ? `${themeColors.border} bg-${themeColors.hoverBg}/30`
                  : `border-white/30 ${themeColors.hoverBg} bg-white/5 hover:bg-orange-400/5`
              }`}
            >
              {!backdropImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white/50" />
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <Image
                    src={backdropImage}
                    alt="backdrop"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20 hover:opacity-100 opacity-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBackdropImage(null);
                        setBackdropFile(null);
                      }}
                      className="bg-black/40 hover:bg-black/60 text-white rounded-lg p-1"
                      aria-label="Remove backdrop"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={backdropFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackdropSelect}
                className="hidden"
              />
              <button
                onClick={() => backdropFileInputRef.current?.click()}
                className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center"
              >
                <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <p className="text-xs text-white/50">
              Drag and drop or click to upload backdrop
            </p>
          </div>
        )}
        {/* Profile Photo Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white/90">
            Profile Photo
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
              isDragging
                ? `${themeColors.border} bg-${themeColors.hoverBg}/30`
                : `border-white/30 ${themeColors.hoverBg} bg-white/5 hover:bg-orange-400/5`
            }`}
          >
            {profileImage ? (
              <>
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center hover:opacity-100 opacity-0 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileImage(null);
                      setProfileImageFile(null);
                    }}
                    className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 shadow-lg"
                    aria-label="Remove profile photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-white/50" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center"
            >
              <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <p className="text-xs text-white/50">
            Drag and drop or click to upload
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {userData?.role?.roleName === "artist" && (
            <div>
              <label className="text-sm font-semibold text-white/90 block mb-2">
                Artist Name
              </label>
              <input
                type="text"
                name="artistName"
                value={formData.artistName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                placeholder="Artist name"
              />
            </div>
          )}
          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-white/90 block mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/90 block mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-white/90 block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly
              aria-disabled="true"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 cursor-default focus:outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          {/* Bio */}
          {userData?.role?.roleName === "artist" && (
            <div>
              <label className="text-sm font-semibold text-white/90 block mb-2">
                Bio
              </label>
              <textarea
                name="artistBio"
                value={formData.artistBio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all resize-none"
                placeholder="Tell us about yourself"
              />
            </div>
          )}
          {/* Location */}
          {/* <div>
            <label className="text-sm font-semibold text-white/90 block mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all"
              placeholder="City, Country"
            />
          </div> */}

          {/* Website, Genre, Spotify, Social Media (Artist only) */}
          {userData?.role?.roleName === "artist" && (
            <>
              <div>
                <label className="text-sm font-semibold text-white/90 block mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/90 block mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  name="artistGenre"
                  value={formData.artistGenre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                  placeholder="e.g. Pop, Rock, Jazz"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/90 block mb-2">
                  Spotify
                </label>
                <input
                  type="text"
                  name="spotify"
                  value={formData.spotify}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                  placeholder="Spotify artist link or ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white/90 block mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white/90 block mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                    placeholder="@username"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => setProfileUpdate && setProfileUpdate(false)}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 px-4 py-2 ${themeColors.solidBg} ${themeColors.solidBgHover} disabled:opacity-50 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
