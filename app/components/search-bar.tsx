"use client";

import type React from "react";

import {
  Search,
  FolderOpen,
  Play,
  Heart,
  SearchCheckIcon,
  User,
  ArrowRightCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

import { useMusicContext } from "../utils/music-context";
import { set } from "react-hook-form";
import { useSidebar } from "../utils/sidebar-context";
import { Song } from "../utils/music-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

// Adjust this to your backend API base URL
const ARTIST_SEARCH_API =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL + "/artists/search";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [artistResults, setArtistResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { songList, setPlayingSong, setIsPlaying, setSelectSong } =
    useMusicContext();
  const { player, setPlayer } = useSidebar();

  const router = useRouter();

  useEffect(() => {
    if (searchValue.trim() === "") {
      setSuggestions([]);
      setArtistResults([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = songList
      .filter(
        (song) =>
          song.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          song.artist?.toLowerCase().includes(searchValue.toLowerCase()) ||
          song.album?.toLowerCase().includes(searchValue.toLowerCase()) ||
          false ||
          song.filename.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0 || artistResults.length > 0);
    setSelectedIndex(-1);
  }, [searchValue, songList, artistResults.length]);
  // Fetch artist results from backend
  const fetchArtistResults = async () => {
    if (!searchValue.trim()) return;
    try {
      const res = await axios.get(
        ARTIST_SEARCH_API + `?query=${encodeURIComponent(searchValue)}`
      );
      setArtistResults(res.data || []);
      setShowSuggestions(
        suggestions.length > 0 || (res.data && res.data.length > 0)
      );
    } catch (err) {
      setArtistResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSongSelect(suggestions[selectedIndex]);
        } else {
          fetchArtistResults();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSongSelect = (song: Song) => {
    // setSearchValue(`${song.title} - ${song.artist}`);
    setSearchValue("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSelectSong(song);
    setPlayingSong(song);
    setPlayer(true);
    setIsPlaying(true);
    console.log("[v0] Selected song:", song);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate popup position when suggestions are shown
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPopupStyle({
        position: "fixed",
        top: rect.bottom + 4, // 4px margin
        left: rect.left,
        width: rect.width,
        zIndex: 40, // High z-index for popup
      });
    }
  }, [showSuggestions]);

  return (
    <div className="mx-4 relative" ref={searchRef}>
      <div className="flex items-center gap-4 bg-slate-700/40 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
        {/* Search Section */}
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-10 h-10 text-white/50 p-2 rounded-lg bg-white/5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search songs or artists..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              searchValue &&
              setShowSuggestions(
                suggestions.length > 0 || artistResults.length > 0
              )
            }
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg font-medium"
          />
        </div>
        <Button
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          onClick={fetchArtistResults}
          aria-label="Search artists"
        >
          <ArrowRightCircle className="w-6 h-6 text-white/70" />
        </Button>
      </div>

      {showSuggestions &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
            style={popupStyle}
          >
            {/* Music Results Section */}
            {suggestions.length > 0 && (
              <>
                <div className="px-4 pt-3 pb-1 text-xs font-bold text-orange-400 uppercase tracking-widest">
                  Music Results
                </div>
                {suggestions.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => handleSongSelect(song)}
                    className={`flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-all duration-200 ${
                      index === selectedIndex
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-l-2 border-orange-500"
                        : ""
                    } ${index === 0 ? "rounded-t-xl" : ""} ${
                      index === suggestions.length - 1 &&
                      artistResults.length === 0
                        ? "rounded-b-xl"
                        : ""
                    }`}
                  >
                    {/* Album Art Placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Play className="w-5 h-5 text-white/70" />
                    </div>
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate text-sm">
                        {song.title}
                      </div>
                      <div className="text-white/60 text-xs truncate">
                        {song.artist}• {song.album}
                      </div>
                    </div>
                    {/* Duration and Actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        <Heart className="w-4 h-4 text-white/60 hover:text-red-400" />
                      </button>
                      <span className="text-white/50 text-xs font-mono">
                        {String(song.metadata?.track_length ?? "")}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="p-3 border-t border-white/10 bg-white/5">
                  <div className="text-white/50 text-xs text-center">
                    {suggestions.length} music result
                    {suggestions.length !== 1 ? "s" : ""} found
                  </div>
                </div>
              </>
            )}
            {/* Artist Results Section */}
            {artistResults.length > 0 && (
              <>
                <div className="px-4 pt-3 pb-1 text-xs font-bold text-blue-400 uppercase tracking-widest">
                  Artist Results
                </div>
                {artistResults.map((artist, idx) => (
                  <div
                    key={artist.id || artist.artistId || idx}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-all duration-200"
                    onMouseDown={() =>
                      router.push(`/player/profile/artist/${artist.artistId}`)
                    }
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <User className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate text-sm">
                        {artist.artistName || artist.name || "Artist"}
                      </div>
                      <div className="text-white/60 text-xs truncate">
                        {artist.genre || artist.email || ""}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 border-t border-white/10 bg-white/5">
                  <div className="text-white/50 text-xs text-center">
                    {artistResults.length} artist result
                    {artistResults.length !== 1 ? "s" : ""} found
                  </div>
                </div>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
