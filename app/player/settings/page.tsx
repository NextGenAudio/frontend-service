"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Volume2,
  Bell,
  Download,
  Shield,
  User,
  Music,
  Headphones,
  Moon,
  Sun,
  Monitor,
  Wifi,
  HardDrive,
  Battery,
  Smartphone,
  Speaker,
  Check,
} from "lucide-react";
import { useTheme } from "@/app/utils/theme-context";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [audioQuality, setAudioQuality] = useState("high");
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Update selectedTheme when theme changes (after hydration)
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const themeOptions = [
    {
      id: "orange",
      name: "Sunset Orange",
      description: "Warm and energetic",
      primary: "orange-500",
      accent: "from-orange-400 to-amber-500",
      preview: "bg-gradient-to-r from-orange-500 to-red-500",
    },
    {
      id: "purple",
      name: "Deep Purple",
      description: "Rich and mysterious",
      primary: "purple-500",
      accent: "from-purple-400 to-pink-500",
      preview: "bg-gradient-to-r from-purple-500 to-indigo-600",
    },
    {
      id: "blue",
      name: "Ocean Blue",
      description: "Calm and focused",
      primary: "blue-500",
      accent: "from-blue-400 to-teal-500",
      preview: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      id: "green",
      name: "Forest Green",
      description: "Natural and fresh",
      primary: "green-500",
      accent: "from-green-400 to-lime-500",
      preview: "bg-gradient-to-r from-green-500 to-emerald-600",
    },
    {
      id: "pink",
      name: "Rose Pink",
      description: "Soft and elegant",
      primary: "pink-500",
      accent: "from-pink-400 to-purple-500",
      preview: "bg-gradient-to-r from-pink-500 to-rose-500",
    },
    {
      id: "teal",
      name: "Electric Teal",
      description: "Modern and vibrant",
      primary: "teal-500",
      accent: "from-teal-400 to-blue-500",
      preview: "bg-gradient-to-r from-teal-500 to-cyan-600",
    },
  ];

  const audioQualityOptions = [
    { id: "low", name: "Low (96 kbps)", description: "Data saving" },
    { id: "medium", name: "Medium (160 kbps)", description: "Balanced" },
    { id: "high", name: "High (320 kbps)", description: "Best quality" },
    { id: "lossless", name: "Lossless", description: "Studio quality" },
  ];

  return (
    <div className="h-screen pb-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
      {/* Background Image */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-0">
        <div
          className="w-[1500px] h-[1000px] bg-contain bg-no-repeat bg-center opacity-10"
          style={{ backgroundImage: "url('/assets/sonex-wall.webp')" }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-amber-500/10 to-orange-600/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-orange-400/10 to-yellow-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${selectedTheme.preview} bg-clip-text text-transparent pb-2`}
          >
            Settings
          </h1>
          <p className="text-white/70 text-lg">
            Customize your SoneX experience
          </p>
        </div>

        {/* Theme Selection */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className={`bg-gradient-to-r ${selectedTheme.preview} p-3 rounded-xl`}
            >
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Theme Colors</h2>
              <p className="text-white/70">
                Choose your preferred color scheme
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {themeOptions.map((themeOption) => (
              <div
                key={themeOption.id}
                className={`relative bg-white/10 backdrop-blur-md border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                  selectedTheme.id === themeOption.id
                    ? "border-white bg-white/15"
                    : "border-white/20 hover:border-white/40"
                }`}
                onClick={() => setSelectedTheme(themeOption)}
              >
                {themeOption.id === theme.id && (
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}

                <div
                  className={`w-full h-16 rounded-xl mb-4 ${themeOption.preview}`}
                ></div>

                <h3 className="font-semibold text-white mb-1">
                  {themeOption.name}
                </h3>
                <p className="text-white/60 text-sm">
                  {themeOption.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Settings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className={`bg-gradient-to-r ${selectedTheme.preview} p-3 rounded-xl`}
            >
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Audio Quality</h2>
              <p className="text-white/70">
                Select your preferred audio quality
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioQualityOptions.map((quality) => (
              <div
                key={quality.id}
                className={`bg-white/10 backdrop-blur-md border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                  audioQuality === quality.id
                    ? ` ${selectedTheme.preview} bg-white/15`
                    : "border-white/20 hover:border-white/40"
                }`}
                onClick={() => setAudioQuality(quality.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{quality.name}</h3>
                    <p className="text-white/60 text-sm">
                      {quality.description}
                    </p>
                  </div>
                  {audioQuality === quality.id && (
                    <div className="bg-white rounded-full p-1">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Playback Settings */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`bg-gradient-to-r ${selectedTheme.preview} p-3 rounded-xl`}
              >
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Playback</h2>
                <p className="text-white/70 text-sm">
                  Control playback behavior
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Download
                    className={`w-5 h-5 text-${selectedTheme.primary}`}
                  />
                  <div>
                    <p className="font-medium text-white">Auto Download</p>
                    <p className="text-white/60 text-sm">
                      Download liked songs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoDownload(!autoDownload)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    autoDownload ? `bg-${selectedTheme.primary}` : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      autoDownload ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Bell className={`w-5 h-5 text-${selectedTheme.primary}`} />
                  <div>
                    <p className="font-medium text-white">Notifications</p>
                    <p className="text-white/60 text-sm">
                      Get notified about new releases
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    notifications
                      ? `bg-${selectedTheme.primary}`
                      : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      notifications ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`bg-gradient-to-r ${selectedTheme.preview} p-3 rounded-xl`}
              >
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">System</h2>
                <p className="text-white/70 text-sm">System preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Moon className={`w-5 h-5 text-${selectedTheme.primary}`} />
                  <div>
                    <p className="font-medium text-white">Dark Mode</p>
                    <p className="text-white/60 text-sm">Use dark theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    darkMode ? `bg-${selectedTheme.primary}` : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      darkMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <HardDrive
                    className={`w-5 h-5 text-${selectedTheme.primary}`}
                  />
                  <div>
                    <p className="font-medium text-white">Storage</p>
                    <p className="text-white/60 text-sm">
                      Manage downloaded music
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className={`bg-gradient-to-r ${selectedTheme.preview} h-2 rounded-full w-3/4`}
                  ></div>
                </div>
                <p className="text-white/60 text-xs">7.2 GB of 10 GB used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Settings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className={`bg-gradient-to-r ${selectedTheme.preview} p-3 rounded-xl`}
            >
              <Speaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Connected Devices
              </h2>
              <p className="text-white/70">Manage your audio devices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Headphones className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">AirPods Pro</p>
                  <p className="text-green-400 text-sm">Connected</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-white">iPhone 15 Pro</p>
                  <p className="text-orange-400 text-sm">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Speaker className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="font-medium text-white">HomePod</p>
                  <p className="text-white/60 text-sm">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            className={`bg-gradient-to-r ${selectedTheme.preview} hover:${selectedTheme.accent} text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-white/25 transition-all duration-300 transform hover:bg-gradient-to-l`}
            onClick={() => setTheme(selectedTheme)}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
