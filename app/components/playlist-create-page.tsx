"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Search,
    Music,
    Clock,
    Plus,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { useRouter } from "next/navigation";
import axios from "axios";

// Backend service URLs
const PLAYLIST_SERVICE_URL = "http://localhost:8082/playlist-service/api/playlists";
const MUSIC_SERVICE_URL = "/api/songs";

interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    genre: string;
}

interface PlaylistFormData {
    name: string;
}

export function PlaylistCreatePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<PlaylistFormData>({ name: "" });
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
    const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    // Remove step state since we're showing everything on one page
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchAvailableSongs();
    }, []);

    const fetchAvailableSongs = async () => {
        try {
            const response = await axios.get(MUSIC_SERVICE_URL, { withCredentials: true });
            setAvailableSongs(response.data);
        } catch (error) {
            console.error("Failed to fetch songs:", error);
            setMessage("❌ Failed to load songs");
        }
    };

    const toggleSongSelection = (song: Song) => {
        setSelectedSongs(prev => {
            const isSelected = prev.find(s => s.id === song.id);
            if (isSelected) {
                return prev.filter(s => s.id !== song.id);
            } else {
                return [...prev, song];
            }
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);

        const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!SUPABASE_ANON_KEY) {
            console.error("Supabase anon key is not defined.");
            setMessage("❌ Configuration error: Missing API key.");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create the playlist
            const playlistResponse = await axios.post(
                PLAYLIST_SERVICE_URL,
                { name: formData.name },
                {
                    withCredentials: true,
                    headers: {
                        apikey: SUPABASE_ANON_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );

            const newPlaylist = playlistResponse.data;

            if (!newPlaylist || !newPlaylist.playlistId) {
                throw new Error("Failed to get playlist ID from the response.");
            }

            const playlistId = newPlaylist.playlistId;

            // Step 2: Add selected songs to the new playlist
            if (selectedSongs.length > 0) {
                const songIds = selectedSongs.map((song) => parseInt(song.id));

                await axios.post(
                    `${PLAYLIST_SERVICE_URL}/${playlistId}/tracks`,
                    { fileIds: songIds },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            apikey: SUPABASE_ANON_KEY,
                        },
                    }
                );
            }

            setMessage("✅ Playlist created successfully!");
            setTimeout(() => {
                router.push("/player/home");
            }, 2000);

        } catch (error) {
            console.error("Failed to create playlist:", error);
            let errorMessage = "❌ Failed to create playlist. Please try again.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = `❌ Error: ${error.response.data.message || 'An unknown error occurred.'}`;
            }
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "" });
        setSelectedSongs([]);
        setSearchQuery("");
        setMessage(null);
    };

    const filteredSongs = availableSongs.filter(song => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            song.title?.toLowerCase().includes(query) ||
            song.artist?.toLowerCase().includes(query) ||
            song.album?.toLowerCase().includes(query)
        );
    });

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full w-full relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-slate-800/80 to-gray-900/90"></div>
            
            <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="text-white hover:bg-white/10 p-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                            Create New Playlist
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Playlist Details Section */}
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                    <h2 className="text-xl font-semibold text-white mb-4">Playlist Details</h2>
                                    <div className="space-y-4">
                                        <Label htmlFor="name" className="text-white text-lg font-medium">
                                            Playlist Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 h-12 text-lg"
                                            placeholder="My Awesome Playlist"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Selected Songs Preview */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-white">Selected Songs</h2>
                                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 px-3 py-1">
                                            {selectedSongs.length} songs
                                        </Badge>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto space-y-2">
                                        {selectedSongs.length === 0 ? (
                                            <p className="text-gray-400 text-center py-4">No songs selected yet</p>
                                        ) : (
                                            selectedSongs.map((song) => (
                                                <div
                                                    key={song.id}
                                                    className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                                                            <Music className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{song.title}</p>
                                                            <p className="text-gray-400 text-xs">{song.artist}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleSongSelection(song)}
                                                        className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/20 h-8 w-8 p-0"
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => router.back()} 
                                        className="border-white/20 text-white hover:bg-white/10 h-12 px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading || !formData.name}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-12 px-6"
                                    >
                                        {loading ? "Creating..." : "Create Playlist"}
                                    </Button>
                                </div>
                            </div>

                            {/* Song Selection Section */}
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                    <h2 className="text-xl font-semibold text-white mb-4">Add Songs</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                placeholder="Search songs in your library..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 h-12"
                                            />
                                        </div>

                                        <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                                            {filteredSongs.map((song) => {
                                                const isSelected = selectedSongs.some(s => s.id === song.id);
                                                return (
                                                    <div
                                                        key={song.id}
                                                        onClick={() => toggleSongSelection(song)}
                                                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                                            isSelected
                                                                ? 'bg-orange-500/20 border border-orange-500/30'
                                                                : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                                isSelected ? 'bg-orange-500' : 'bg-white/10'
                                                            }`}>
                                                                <Music className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium">{song.title}</p>
                                                                <p className="text-gray-400 text-sm">{song.artist}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-gray-400 text-sm flex items-center">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {formatDuration(song.duration)}
                                                            </span>
                                                            {isSelected && (
                                                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                                                    <Plus className="w-4 h-4 text-white rotate-45" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className="mt-6">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                    <p className="text-white text-center text-lg">{message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
