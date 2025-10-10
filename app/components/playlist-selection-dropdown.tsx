"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Music, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { useEntityContext } from "../utils/entity-context";
import { Playlist } from "../utils/entity-context";
import { useRouter } from "next/navigation";
import axios from "axios";

const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;

interface PlaylistSelectionDropdownProps {
  songId: string;
  onAddToPlaylist?: (playlistId: number, playlistName: string) => void;
  onCreateNewPlaylist?: () => void;
  onClose?: () => void;
}

export function PlaylistSelectionDropdown({
  songId,
  onAddToPlaylist,
  onCreateNewPlaylist,
  onClose,
}: PlaylistSelectionDropdownProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const { playlistList } = useEntityContext();
  const router = useRouter();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    // Set playlists from context and stop loading
    setPlaylists(playlistList);
    setLoading(false);
  }, [playlistList]);

  const handlePlaylistSelect = async(playlist: Playlist) => {
    const playlistId = playlist.id;
    setSelectedPlaylist(playlistId);

    // Step 2: Add selected songs to the new playlist

    const songIds = [songId]; // Wrap single songId in an array

    await axios.post(
      `${PLAYLIST_SERVICE_URL}/${playlistId}/tracks`,
      { fileIds: songIds },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Added song ${songId} to playlist ${playlistId}`);
    onAddToPlaylist?.(playlist.id, playlist.name);
    onClose?.();
  };

  const handleCreateNew = () => {
    onCreateNewPlaylist?.();
    onClose?.();
  };

  return (
    <div className="relative z-[99999]" ref={dropdownRef}>
      <div className="absolute right-0  bottom-full mb-2 z-[99999] min-w-[280px] max-w-[320px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Glass background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br opacity-10 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-white/5" />

        <div className="relative z-10">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">
              Add to playlist
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Choose a playlist to add this song to
            </p>
          </div>

          {/* Create New Playlist Button */}
          <div className="p-2">
            <button
              className={`w-full px-3 py-2.5 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group rounded-lg border border-white/10 hover:border-white/20`}
              onClick={() => router.push("/player/playlist/create")}
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Create new playlist</div>
                <div className="text-xs text-white/50">
                  Make a new playlist for this song
                </div>
              </div>
            </button>
          </div>

          {/* Playlists List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  <span className="text-sm">Loading playlists...</span>
                </div>
              </div>
            ) : playlists.length === 0 ? (
              <div className="p-4 text-center">
                <Music className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-sm text-white/60">No playlists found</p>
                <p className="text-xs text-white/40">
                  Create your first playlist above
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {playlists.map((playlist: Playlist) => (
                  <button
                    key={playlist.id}
                    className={`w-full px-3 py-2.5 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group rounded-lg hover:bg-white/10`}
                    onClick={() => handlePlaylistSelect(playlist)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {playlist.playlistArt ? (
                        <img
                          src={playlist.playlistArt}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-4 w-4 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {playlist.name}
                      </div>
                      <div className="text-xs text-white/50 truncate">
                        {playlist.musicCount || 0} songs
                        {playlist.description && ` • ${playlist.description}`}
                      </div>
                    </div>
                    {selectedPlaylist === playlist.id && (
                      <Check
                        className={`h-4 w-4 ${themeColors.text} flex-shrink-0`}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
