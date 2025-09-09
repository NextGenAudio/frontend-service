"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Upload,
  Music,
  ImageIcon,
  X,
  Check,
  AlertCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
// import { Textarea } from "@/app/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import axios from "axios";

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

export function MusicUpload() {
  const [musicFile, setMusicFile] = useState<UploadedFile | null>(null);
  const [artworkFile, setArtworkFile] = useState<UploadedFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    year: "",
    description: "",
  });

  const musicInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const handleMusicDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const musicFile = files.find((file) => file.type.startsWith("audio/"));
    if (musicFile) {
      handleMusicUpload(musicFile);
    }
  };

  const handleArtworkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) {
      handleArtworkUpload(imageFile);
    }
  };

  const handleMusicUpload = (file: File) => {
    const uploadFile: UploadedFile = {
      file,
      progress: 0,
      status: "uploading",
    };
    setMusicFile(uploadFile);

    // Simulate upload progress
    const interval = setInterval(() => {
      setMusicFile((prev) => {
        if (!prev) return null;
        const newProgress = Math.min(prev.progress + 10, 100);
        return {
          ...prev,
          progress: newProgress,
          status: newProgress === 100 ? "completed" : "uploading",
        };
      });
    }, 200);

    setTimeout(() => clearInterval(interval), 2000);
  };

  const handleArtworkUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadFile: UploadedFile = {
        file,
        progress: 100,
        status: "completed",
        preview: e.target?.result as string,
      };
      setArtworkFile(uploadFile);
    };
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!musicFile) {
      alert("Please select a music file!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", musicFile.file); // backend expects "file"
      formDataToSend.append("user", formData.title);
      // If you also want to send artwork and metadata:
      if (artworkFile) {
        formDataToSend.append("artwork", artworkFile.file);
      }
      if (formData) {
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, value as string);
        });
      }

      const response = await axios.post(
        "http://localhost:8080/files/upload",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log("Upload progress:", percent + "%");
            }
          },
        }
      );

      console.log("Upload successful:", response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900/20 p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Upload Your Music
          </h1>
          {/* <p className="text-gray-400">Share your creativity with the world</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Music Upload Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Music className="w-6 h-6 text-orange-400" />
              Music File
            </h2>

            {!musicFile ? (
              <div
                onDrop={handleMusicDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => musicInputRef.current?.click()}
                className="border-2 border-dashed border-orange-400/30 rounded-xl p-12 text-center cursor-pointer hover:border-orange-400/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <Upload className="w-16 h-16 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-xl text-white mb-2">
                  Drop your music file here
                </p>
                <p className="text-gray-400">
                  or click to browse (MP3, WAV, FLAC)
                </p>
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleMusicUpload(e.target.files[0])
                  }
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Music className="w-8 h-8 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">
                        {musicFile.file.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {(musicFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMusicFile(null)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${musicFile.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {musicFile.progress}% uploaded
                  </span>
                  {musicFile.status === "completed" && (
                    <span className="text-green-400 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Complete
                    </span>
                  )}
                  {musicFile.status === "error" && (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Error
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Artwork Upload */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-orange-400" />
                Music Artwork
              </h2>

              {!artworkFile ? (
                <div
                  onDrop={handleArtworkDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => artworkInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-orange-400/30 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400/50 hover:bg-white/5 transition-all duration-300 group flex flex-col items-center justify-center"
                >
                  <ImageIcon className="w-12 h-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-white mb-2">Drop artwork here</p>
                  <p className="text-gray-400 text-sm">
                    JPG, PNG (min 500x500)
                  </p>
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
                  <img
                    src={artworkFile.preview || "/placeholder.svg"}
                    alt="Album artwork"
                    className="w-full h-full object-cover"
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
                  <Label htmlFor="title" className="text-white mb-2 block">
                    Folder Name *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
                    placeholder="Enter track title"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-white mb-2 block"
                  >
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20 min-h-[100px] w-full rounded-md p-2"
                    placeholder="Tell us about your track..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={!musicFile || musicFile.status !== "completed"}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Upload Track
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
