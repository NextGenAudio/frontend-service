"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Plus,
  Minus,
  Heart,
  Share2,
  Download,
  Trash2,
  Edit3,
  ListStart,
} from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";

interface SongOptionsDropdownProps {
  songId: string;
  liked?: boolean;
  isInPlaylist?: boolean;
  onAddToPlaylist?: () => void;
  onRemoveFromPlaylist?: () => void;
  onToggleLike?: () => void;
  onAddToQueue?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
}

export function SongOptionsDropdown({
  songId,
  liked = false,
  isInPlaylist = false,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onAddToQueue,
  onToggleLike,
  onShare,
  onDownload,
  onDelete,
  onEdit,
  onClose,
}: SongOptionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  useEffect(() => {
    console.log("Dropdown mounted");
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

  const handleOptionClick = (callback?: () => void) => {
    callback?.();
    onClose?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute right-0 top-full mt-2 z-[999999] min-w-[200px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Glass background overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-10 backdrop-blur-xl`}
        />
        <div className="absolute inset-0 bg-white/5" />

        <div className="relative z-10 py-2">
          {/* Add/Remove from Playlist */}
          {isInPlaylist ? (
            <button
              className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
              onClick={() => handleOptionClick(onRemoveFromPlaylist)}
            >
              <Minus
                className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
              />
              Remove from playlist
            </button>
          ) : (
            <button
              className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
              onClick={() => handleOptionClick(onAddToPlaylist)}
            >
              <Plus
                className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
              />
              Add to playlist
            </button>
          )}

          {/* Like/Unlike */}
          <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onToggleLike)}
          >
            <Heart
              className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                liked ? "text-red-400 fill-red-400" : themeColors.text
              }`}
            />
            {liked ? "Remove from liked songs" : "Add to liked songs"}
          </button>
          <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onAddToQueue)}
          >
            <ListStart
              className={`h-4 w-4 group-hover:scale-110 transition-transform ${themeColors.text}`}
            />
            {"Add to queue"}
          </button>
          {/* Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Share */}
          <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onShare)}
          >
            <Share2
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Share
          </button>

          {/* Download */}
          {/* <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onDownload)}
          >
            <Download
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Download
          </button> */}

          {/* Edit */}
          <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onEdit)}
          >
            <Edit3
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Edit song info
          </button>

          {/* Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Delete */}
          <button
            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 flex items-center gap-3 group"
            onClick={() => handleOptionClick(onDelete)}
          >
            <Trash2 className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
            Delete from library
          </button>
        </div>
      </div>
    </div>
  );
}
