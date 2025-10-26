"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Music, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { useEntityContext } from "../utils/entity-context";
import { Playlist } from "../utils/entity-context";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "./ui/button";

const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;

interface PlaylistSelectionDropdownProps {
  songId: string;
  onAddToPlaylist?: (playlistIds: number[]) => void;
  onRemoveFromPlaylist?: (playlistIds: number[]) => void;
  onCreateNewPlaylist?: () => void;
  onClose?: () => void;
  onShowAlert?: (message: string) => void;
}

export function PlaylistSelectionDropdown({
  songId,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onCreateNewPlaylist,
  onClose,
  onShowAlert,
}: PlaylistSelectionDropdownProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const { playlistList } = useEntityContext();
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<number[]>([]);
  const [databasePlaylistIds, setDatabasePlaylistIds] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
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

  // const handlePlaylistSelect = async(playlist: Playlist) => {
  //   const playlistId = playlist.id;
  //   setSelectedPlaylist(playlistId);

  //   // Step 2: Add selected songs to the new playlist

  //   const songIds = [songId]; // Wrap single songId in an array

  //   await axios.post(
  //     `${PLAYLIST_SERVICE_URL}/${playlistId}/tracks`,
  //     { fileIds: songIds },
  //     {
  //       withCredentials: true,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   console.log(`Added song ${songId} to playlist ${playlistId}`);
  //   onAddToPlaylist?.(playlist.id);
  //   onClose?.();
  // };
  useEffect(() => {
    async function fetchAddedPlaylistIds() {
      const response = await axios.get(
        `${PLAYLIST_SERVICE_URL}/playlist-service/music/playlist-ids/${songId}`,
        {
          withCredentials: true,
        }
      );

      const addedPlaylistIds: number[] = response.data;
      console.log("Added playlist IDs:", addedPlaylistIds);
      setAddedPlaylistIds(addedPlaylistIds);
      setDatabasePlaylistIds(addedPlaylistIds);
    }

    fetchAddedPlaylistIds();
  }, [songId]);

  // Check if there are changes
  useEffect(() => {
    const playlistsToAdd = addedPlaylistIds.filter(
      (id) => !databasePlaylistIds.includes(id)
    );
    const playlistsToRemove = databasePlaylistIds.filter(
      (id) => !addedPlaylistIds.includes(id)
    );
    setHasChanges(playlistsToAdd.length > 0 || playlistsToRemove.length > 0);
  }, [addedPlaylistIds, databasePlaylistIds]);

  function handleSubmitPlaylistChanges() {
    // Determine which playlists to add and which to remove
    const playlistsToAdd = addedPlaylistIds.filter(
      (id) => !databasePlaylistIds.includes(id)
    );
    const playlistsToRemove = databasePlaylistIds.filter(
      (id) => !addedPlaylistIds.includes(id)
    );
    console.log("Playlists to add:", playlistsToAdd);
    console.log("Playlists to remove:", playlistsToRemove);
    // Call the appropriate callbacks
    if (playlistsToAdd.length > 0) {
      onAddToPlaylist?.(playlistsToAdd);
    }

    if (playlistsToRemove.length > 0) {
      onRemoveFromPlaylist?.(playlistsToRemove);
    }

    // Show success alert
    onShowAlert?.("✅ Playlists updated successfully!");

    // Close the dropdown
    onClose?.();
  }

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
            <Button
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
            </Button>
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
                  <Button
                    key={playlist.id}
                    className={`w-full px-3 py-2.5 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group rounded-lg hover:bg-white/10`}
                    onClick={() => {
                      setAddedPlaylistIds((prev) =>
                        prev.includes(playlist.id)
                          ? prev.filter((id) => id !== playlist.id)
                          : [...prev, playlist.id]
                      );
                      // Add or remove song from playlist
                    }}
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
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        addedPlaylistIds.includes(playlist.id)
                          ? `${themeColors.border} bg-gradient-to-r ${themeColors.gradient}`
                          : `border-gray-400 ${themeColors.hover}`
                      }`}
                    >
                      {addedPlaylistIds.includes(playlist.id) && (
                        <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs px-3 py-1.5 h-auto rounded-lg transition-all duration-200"
            >
              Cancel
            </Button>
            {hasChanges && (
              <Button
                onClick={handleSubmitPlaylistChanges}
                className={`bg-gradient-to-r ${themeColors.gradient} text-white text-xs px-4 py-1.5 h-auto rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
