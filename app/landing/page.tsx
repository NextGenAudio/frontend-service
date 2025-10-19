"use client";

import { Button } from "@/app/components/ui/button";
import {
  Play,
  Music,
  Zap,
  Palette,
  Volume2,
  Headphones,
  Sparkles,
  Shield,
  Github,
  Twitter,
  Mail,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ProfileAvatar from "../components/profile-avatar";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export function Landing() {
  const { status, data: session } = useSession();
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, set_email] = useState("");

  useEffect(() => {
    const updateProfiles = async () => {
      if (session?.user?.email) {
        const result = await fetch(`/api/user?email=${session.user.email}`);
        const data = await result.json();
        set_first_name(data.data?.first_name);
        set_last_name(data.data?.last_name);
        set_email(data.data?.email);
        console.log("User data:", data.data);

        if (!data.data) {
          const createResult = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: session.user.name!.split(" ")[0],
              last_name: session.user.name!.split(" ").slice(1).join(" "),
              email: session.user.email,
              password: "",
              image: session.user.image,
              created_at: new Date().toISOString(),
              created_by: "provider",
            }),
          });
          const createData = await createResult.json();
          console.log("Created user data:", createData);
        }
      }
    };
    updateProfiles();
  }, [session]);

  if (status === "loading") {
    return null; // or a loading spinner
  }

  // Change the navigation of the TrySonex button if user is authenticated
  const TrySonexHandler = () => {
    if (status === "authenticated") {
      window.location.href = "/player";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className=" z-50 fixed top-0 left-0 right-0">
        <div className="bg-black/30 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">SoneX</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  About
                </a>
                <a
                  href="#download"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  Download
                </a>
                <a
                  href="#contact"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  Contact
                </a>
              </div>
              {status === "unauthenticated" && (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border border-white/20 backdrop-blur-md shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
                    Sign Up
                  </Button>
                </div>
              )}
              {status === "authenticated" && (
                <div className="flex items-center space-x-12">
                  {session?.user?.name && (
                    <span className=" text-sm font-medium text-orange-400 tracking-wider uppercase bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
                      {session?.user?.name || first_name + " " + last_name}
                    </span>
                  )}
                  <ProfileAvatar w={12} h={12} />
                  <Button
                    onClick={() => signOut()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border border-white/20 backdrop-blur-md shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1520px] mx-auto px-6 pt-60 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-sm font-medium text-orange-400 tracking-wider uppercase bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
                    Next-Generation
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    SoneX
                  </span>
                  <span className=" text-white"> PLAYER</span>
                </h1>
              </div>

              <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                Experience music like never before with our revolutionary
                glassmorphism interface. Seamlessly blend style and
                functionality in the ultimate audio experience.
              </p>

              {/* Feature Points */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange-400/30">
                    <Zap className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-white/80">
                    Advanced glassmorphism UI with floating controls and
                    immersive visuals
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange-400/30">
                    <Volume2 className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-white/80">
                    Professional audio controls with equalizer, crossfade, and
                    spatial audio
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange-400/30">
                    <Palette className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-white/80">
                    Customizable themes with real-time visualizations and smooth
                    animations
                  </p>
                </div>
              </div>

              {/* CTA Button */}

              <div className="pt-4">
                <Link href="/login">
                  <Button
                    onClick={TrySonexHandler}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border border-white/20 backdrop-blur-md px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try SoneX
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Player Interface Screenshot */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-white/30 rounded-2xl p-6 shadow-2xl">
                  {/* Sidebar Preview */}
                  <div className="flex space-x-4">
                    <div className="w-16 bg-gradient-to-br from-orange-400/20 to-red-500/20 backdrop-blur-md rounded-xl p-2 space-y-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-10 h-8 bg-white/10 rounded-lg"></div>
                        <div className="w-10 h-8 bg-white/10 rounded-lg"></div>
                        <div className="w-10 h-8 bg-white/10 rounded-lg"></div>
                        <div className="w-10 h-8 bg-orange-400/30 rounded-lg"></div>
                      </div>
                    </div>

                    {/* Main Player Area */}
                    <div className="flex-1 space-y-4">
                      {/* Top Panels */}
                      <div className="grid grid-cols-3 gap-3 h-60">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-2">
                            Library
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-white/10 rounded"></div>
                            <div className="w-3/4 h-2 bg-white/10 rounded"></div>
                            <div className="w-1/2 h-2 bg-white/10 rounded"></div>
                          </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-2">
                            Playlist
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-orange-400/30 rounded"></div>
                            <div className="w-4/5 h-2 bg-white/10 rounded"></div>
                            <div className="w-3/5 h-2 bg-white/10 rounded"></div>
                          </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-2">
                            Details
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded mb-1"></div>
                          <div className="w-full h-1 bg-white/10 rounded"></div>
                        </div>
                      </div>

                      {/* Floating Player Controls */}
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg"></div>
                            <div>
                              <div className="w-20 h-2 bg-white/80 rounded mb-1"></div>
                              <div className="w-16 h-1 bg-white/40 rounded"></div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                            <div className="w-8 h-8 bg-orange-400/30 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                          </div>
                        </div>
                        <div className="w-full h-1 bg-white/20 rounded-full">
                          <div className="w-1/3 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glow Effects */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-orange-400 tracking-wider uppercase bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
              Features
            </span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover the advanced capabilities that make SoundWave the
              ultimate music experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Immersive Audio
              </h3>
              <p className="text-white/70">
                Experience crystal-clear sound with advanced audio processing
                and spatial audio support.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Visual Effects
              </h3>
              <p className="text-white/70">
                Real-time audio visualizations and stunning glassmorphism
                interface effects.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Privacy First
              </h3>
              <p className="text-white/70">
                Your music library stays private with local storage and
                encrypted connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-sm font-medium text-orange-400 tracking-wider uppercase bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
                  About SoundWave
                </span>
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Redefining Music
                  <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Experience
                  </span>
                </h2>
              </div>

              <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                <p>
                  SoundWave represents the pinnacle of modern music player
                  design, combining cutting-edge glassmorphism aesthetics with
                  professional-grade audio capabilities. Our vision is to create
                  an immersive musical journey that transcends traditional
                  boundaries.
                </p>
                <p>
                  Built with passion by music enthusiasts and design experts,
                  SoundWave delivers an unparalleled user experience through
                  innovative interface design, advanced audio processing, and
                  seamless integration across all your devices.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                    50K+
                  </div>
                  <div className="text-white/70 text-sm">Active Users</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                    99.9%
                  </div>
                  <div className="text-white/70 text-sm">Uptime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                    4.9★
                  </div>
                  <div className="text-white/70 text-sm">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Mission & Values */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-white/80 leading-relaxed">
                  To revolutionize how people interact with music through
                  innovative design and cutting-edge technology, making every
                  listening session a memorable experience.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Innovation First
                </h3>
                <p className="text-white/80 leading-relaxed">
                  We push the boundaries of what's possible in music player
                  design, constantly exploring new technologies and user
                  interface paradigms.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Audio Excellence
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Every feature is designed with audio quality in mind, ensuring
                  your music sounds exactly as the artist intended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="py-20 border-t border-white/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4">
            <span className="text-sm font-medium text-orange-400 tracking-wider uppercase bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
              Introducing SoneX
            </span>
            <h2 className="text-4xl font-bold text-white">
              Architecting the future of
            </h2>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Music Experience
            </h3>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black/30 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SoundWave</span>
              </div>
              <p className="text-white/60">
                The next generation music player with glassmorphism design and
                professional audio features.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a
                  href="#features"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  About
                </a>
                <a
                  href="#download"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  Download
                </a>
                <a
                  href="#pricing"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a
                  href="#help"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="#contact"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  Contact
                </a>
                <a
                  href="#docs"
                  className="block text-white/60 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2024 SoundWave. All rights reserved. Built with glassmorphism
              and love.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
