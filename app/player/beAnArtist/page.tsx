"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Music,
  User,
  Mail,
  Globe,
  Instagram,
  Youtube,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { getGeneralThemeColors } from "@/app/lib/theme-colors";
import { useTheme } from "@/app/utils/theme-context";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;
import AlertBar from "@/app/components/alert-bar";

export default function ArtistRequestForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    stageName: "",
    primaryGenre: "",
    artistBio: "",
    website: "",
    instagram: "",
    youtube: "",
    spotify: "",
    soundcloud: "",
    sampleWork: "",
  });
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Try to parse sonex_user cookie which is stored as JSON string
    const raw = Cookies.get("sonex_user");
    let profileId: string | undefined;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // cookie shape may vary; try a couple of likely places
        profileId =
          parsed?.profileId ??
          parsed?.User?.profileId ??
          parsed?.user?.profileId;
      } catch (err) {
        console.warn("Failed to parse sonex_user cookie", err);
      }
    }

    try {
      const url = `${USER_MANAGEMENT_SERVICE_URL}/requests${
        profileId ? `?profileId=${encodeURIComponent(profileId)}` : ""
      }`;
      const res = await axios.post(url, formData, { withCredentials: true });
      console.log("[v0] Artist request submitted:", res?.data ?? formData);
      // show alert first, then show the submitted UI after a short delay
      setAlertMessage("✅ Request submitted");
      setTimeout(() => setIsSubmitted(true), 1000);
    } catch (err) {
      console.error("Failed to submit artist request:", err);
      // Keep isSubmitted false so user can retry; consider showing a toast/alert here
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center">
          <div
            className={`w-20 h-20 bg-gradient-to-r ${themeColors.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Request Submitted!
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Thank you for your interest in becoming an artist on SoundWave.
            We'll review your application and get back to you within 3-5
            business days.
          </p>
          <Button
            onClick={() => router.push("/player/profile")}
            className={`bg-gradient-to-r ${themeColors.gradient}  text-white px-8 py-6 text-lg`}
          >
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto pb-96 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${themeColors.gradient} rounded-2xl mb-6`}
          >
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Become an{" "}
            <span
              className={`bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
            >
              Artist
            </span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Join thousands of artists sharing their music on SoundWave. Fill out
            the form below to start your journey.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl"
        >
          {/* Personal Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <User className={`w-6 h-6 ${themeColors.text}`} />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-white mb-2 block">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20"
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white mb-2 block">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="mt-6">
              <Label htmlFor="email" className="text-white mb-2 block">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20 pl-11"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Artist Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Music className={`w-6 h-6 ${themeColors.text}`} />
              Artist Information
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="artistName" className="text-white mb-2 block">
                  Artist/Stage Name *
                </Label>
                <Input
                  id="stageName"
                  name="stageName"
                  value={formData.stageName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20"
                  placeholder="Your artist name"
                />
              </div>
              <div>
                <Label htmlFor="genre" className="text-white mb-2 block">
                  Primary Genre *
                </Label>
                <Input
                  id="primaryGenre"
                  name="primaryGenre"
                  value={formData.primaryGenre}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20"
                  placeholder="e.g., Pop, Rock, Hip-Hop, Electronic"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-white mb-2 block">
                  Artist Bio *
                </Label>
                <Textarea
                  id="artistBio"
                  name="artistBio"
                  value={formData.artistBio}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20 resize-none"
                  placeholder="Tell us about yourself, your music journey, and what makes you unique..."
                />
              </div>
            </div>
          </div>

          {/* Social Media & Links */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Globe className={`w-6 h-6 ${themeColors.text}`} />
              Social Media & Portfolio
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="website" className="text-white mb-2 block">
                  Website
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20 pl-11"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="instagram" className="text-white mb-2 block">
                    Instagram
                  </Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20 pl-11"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="youtube" className="text-white mb-2 block">
                    YouTube
                  </Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="youtube"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20 pl-11"
                      placeholder="Channel URL"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="spotify" className="text-white mb-2 block">
                    Spotify Artist Profile
                  </Label>
                  <Input
                    id="spotify"
                    name="spotify"
                    value={formData.spotify}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20"
                    placeholder="Spotify artist URL"
                  />
                </div>
                <div>
                  <Label htmlFor="soundcloud" className="text-white mb-2 block">
                    SoundCloud
                  </Label>
                  <Input
                    id="soundcloud"
                    name="soundcloud"
                    value={formData.soundcloud}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20"
                    placeholder="SoundCloud profile URL"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="portfolio" className="text-white mb-2 block">
                  Portfolio/Sample Work *
                </Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="sampleWork"
                    name="sampleWork"
                    type="url"
                    value={formData.sampleWork}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/20 pl-11"
                    placeholder="Link to your music samples or portfolio"
                  />
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Provide a link to your music samples (YouTube, SoundCloud,
                  etc.)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              className={`flex-1 bg-gradient-to-r ${themeColors.gradient} hover:brightness-110 text-white py-6 text-lg font-semibold shadow-lg transition-all duration-300`}
            >
              Submit Application
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none border-white/20 text-white hover:bg-white/10 py-6 px-8 bg-transparent"
              onClick={() =>
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  stageName: "",
                  primaryGenre: "",
                  artistBio: "",
                  website: "",
                  instagram: "",
                  youtube: "",
                  spotify: "",
                  soundcloud: "",
                  sampleWork: "",
                })
              }
            >
              Clear Form
            </Button>
          </div>

          <p className="text-white/60 text-sm text-center mt-6">
            * Required fields. By submitting this form, you agree to our Terms
            of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
