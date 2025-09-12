"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Plus,
    Search,
    Music,
    Clock,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
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

export function PlaylistCreate() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<PlaylistFormData>({ name: "" });
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
    const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'basic' | 'songs'>('basic');
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchAvailableSongs();
        }
    }, [isOpen]);

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
            resetForm();
            setIsOpen(false);

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
        setStep('basic');
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
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
                <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    onClick={() => setIsOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Playlist
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900/20 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                        Create New Playlist
                    </DialogTitle>
                </DialogHeader>

                {step === 'basic' && (
                    <div className="space-y-6 pt-4">
                        <div>
                            <Label htmlFor="name" className="text-white mb-2 block">Playlist Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400"
                                placeholder="My Awesome Playlist"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setStep('songs')}
                                disabled={!formData.name}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                            >
                                Next: Add Songs
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'songs' && (
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Add Songs to "{formData.name}"</h3>
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                                {selectedSongs.length} songs selected
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search songs in your library..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400"
                                />
                            </div>

                            <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                                {filteredSongs.map((song) => {
                                    const isSelected = selectedSongs.some(s => s.id === song.id);
                                    return (
                                        <div
                                            key={song.id}
                                            onClick={() => toggleSongSelection(song)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-orange-500/20 border border-orange-500/30'
                                                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    isSelected ? 'bg-orange-500' : 'bg-white/10'
                                                }`}>
                                                    <Music className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{song.title}</p>
                                                    <p className="text-gray-400 text-sm">{song.artist}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                        <span className="text-gray-400 text-sm flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(song.duration)}
                        </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={() => setStep('basic')} className="border-white/20 text-white hover:bg-white/10">
                                Back
                            </Button>
                            <div className="space-x-2">
                                <Button variant="outline" onClick={() => setIsOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                >
                                    {loading ? "Creating..." : "Create Playlist"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white text-center">{message}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}