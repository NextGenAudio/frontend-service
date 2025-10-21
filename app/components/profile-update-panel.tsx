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

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;

interface ProfileData {
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
  const { setProfileUpdate } = useSidebar();

  const [userData, setUserData] = useState<any>(null);
  const [artistData, setArtistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
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
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const cookie = Cookies.get("sonex_user");
    let userDataTemp;
    if (cookie) {
      userDataTemp = JSON.parse(cookie).User;
      setUserData(userDataTemp);
      setFormData(userDataTemp);
    }
    if (userDataTemp.role?.roleName === "artist") {
      const fetchArtistData = async () => {
        try {
          const res = await axios.get(
            `${USER_MANAGEMENT_SERVICE_URL}/artists?profileId=${artistData.profileId}`
          );
          setArtistData(res.data);
          console.log("Artist data:", res.data);
        } catch (error) {
          console.error("Error fetching artist data:", error);
        }
      };
      fetchArtistData();
    }
  }, []);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setProfileUpdate && setProfileUpdate(false);
  };

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-3 border py-2 border-white/20 shadow-lg">
        <UserRoundPen className={`w-6 h-6 ${themeColors.text}`} />
        <h2 className="text-lg font-semibold text-white/90 flex items-center">
          Edit Profile
          <span className="text-2xl text-white/60 font-normal ml-2">|</span>
          <span className="text-sm text-white/60 font-normal ml-2">
            {profile?.firstName} {profile?.lastName}
          </span>
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
                ? "border-orange-400 bg-orange-400/10"
                : "border-white/30 hover:border-orange-400/50 bg-white/5 hover:bg-orange-400/5"
            }`}
          >
            {profileImage ? (
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
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
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all"
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
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all"
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
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all resize-none"
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

          {/* Website */}
          {userData?.role?.roleName === "artist" && (
            <div>
              <label className="text-sm font-semibold text-white/90 block mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all"
                placeholder="https://example.com"
              />
            </div>
          )}
          {/* Social Media */}
          {userData?.role?.roleName === "artist" && (
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
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all"
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
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all"
                  placeholder="@username"
                />
              </div>
            </div>
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
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 disabled:opacity-50 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
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
