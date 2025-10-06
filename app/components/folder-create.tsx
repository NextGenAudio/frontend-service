"use client";

import type React from "react";
import { useState, useRef } from "react";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import axios from "axios";
import { useFileHandling } from "../utils/entity-handling-context";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import clsx from "clsx";
import { useSidebar } from "../utils/sidebar-context";
import AlertBar from "./alert-bar";
import Image from "next/image";

interface UploadedFile {
  file: File;
  preview?: string;
}

const MUSIC_LIBRARY_SERVICE_URL = process.env.MUSIC_LIBRARY_SERVICE_URL;

export function FolderCreate() {
  const [artworkFile, setArtworkFile] = useState<UploadedFile | null>(null);
  const [formData, setFormData] = useState({
    name: "New Folder",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);

  const artworkInputRef = useRef<HTMLInputElement>(null);
  const { folderCreateRefresh, setFolderCreateRefresh } = useFileHandling();
  const { player } = useSidebar();
  // Handle drag-drop for artwork
  const handleArtworkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) {
      handleArtworkUpload(imageFile);
    }
  };

  // Preview artwork before sending
  const handleArtworkUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setArtworkFile({
        file,
        preview: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit form data to Spring Boot API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (artworkFile) {
        formDataToSend.append("artwork", artworkFile.file);
      }

      await axios.post(`${MUSIC_LIBRARY_SERVICE_URL}/folders`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage("✅ Folder created successfully!");
      setFormData({ name: "", description: "" });
      setArtworkFile(null);
      setFolderCreateRefresh((old) => old + 1); // increment key
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create folder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Background Effects */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${themeColors.gradient} opacity-10 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r ${themeColors.gradient} opacity-5 rounded-full blur-3xl animate-pulse delay-1000`}
        />
      </div> */}

      <div
        className={clsx(
          `h-screen overflow-y-auto relative max-w-4xl mx-auto min-h-full ${
            player ? "mb-64" : "mb-8"
          }`
        )}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent mb-2`}
          >
            Create Folder
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className={clsx(`grid md:grid-cols-2  gap-8`)}
        >
          {/* Artwork Upload */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <ImageIcon className={`w-6 h-6 ${themeColors.text}`} />
              Folder Artwork
            </h2>

            {!artworkFile ? (
              <div
                onDrop={handleArtworkDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => artworkInputRef.current?.click()}
                className={`aspect-square border-2 border-dashed ${themeColors.border} rounded-xl p-8 text-center cursor-pointer ${themeColors.hoverBg} hover:border-white/50 transition-all duration-300 group flex flex-col items-center justify-center`}
              >
                <ImageIcon
                  className={`w-12 h-12 ${themeColors.text} mb-4 group-hover:scale-110 transition-transform`}
                />
                <p className="text-white mb-2">Drop artwork here</p>
                <p className="text-gray-400 text-sm">JPG, PNG (min 500x500)</p>
                <input
                  ref={artworkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleArtworkUpload(e.target.files[0])
                  }
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative aspect-square rounded-xl overflow-hidden group">
                <Image
                  src={artworkFile.preview || "/placeholder.svg"}
                  alt="Folder artwork"
                  className="w-full h-full object-cover"
                  width={256}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setArtworkFile(null)}
                    className="text-white hover:text-red-400 hover:bg-red-400/10"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Folder Details
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Folder Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:${themeColors.border} focus:ring-opacity-20`}
                  placeholder="Enter folder name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:${themeColors.border} focus:ring-opacity-20 min-h-[100px] w-full rounded-md p-2`}
                  placeholder="Enter folder description..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div
            className={clsx(
              "col-span-2 text-center mt-6",
              player ? "mb-32" : "mb-8"
            )}
          >
            <Button
              type="submit"
              disabled={!formData.name || loading}
              className={`bg-gradient-to-r ${theme.preview} hover:${themeColors.gradient} text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? "Creating..." : "Create Folder"}
            </Button>
            {message && <AlertBar message={message} setMessage={setMessage} />}
          </div>
        </form>
      </div>
    </div>
  );
}
