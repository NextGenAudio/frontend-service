"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Play,
  Plus,
  Edit3,
  Trash2,
  Share2,
  Copy,
  Download,
  Shuffle,
  Heart,
  Users,
  Lock,
  Globe,
} from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { Button } from "@radix-ui/themes";

interface PlaylistOptionsDropdownProps {
  playlistId: number;
  playlistName: string;
  isOwner?: boolean;
  isLiked?: boolean;
  isPublic?: boolean;
  isCollaborative?: boolean;
  onPlay?: () => void;
  onShuffle?: () => void;
  onAddSongs?: () => void;
  onEdit?: () => void;
//   onRename?: () => void;
//   onCopy?: () => void;
  onDelete?: () => void;
//   onShare?: () => void;
//   onDownload?: () => void;
//   onToggleLike?: () => void;
//   onTogglePublic?: () => void;
//   onToggleCollaborative?: () => void;
//   onManageCollaborators?: () => void;
  onClose?: () => void;
}

export function PlaylistOptionsDropdown({
  playlistId,
  playlistName,
  isOwner = true,
  isLiked = false,
  isPublic = false,
  isCollaborative = false,
  onPlay,
  onShuffle,
  onAddSongs,
  onEdit,
//   onRename,
//   onCopy,
  onDelete,
//   onShare,
//   onDownload,
//   onToggleLike,
//   onTogglePublic,
//   onToggleCollaborative,
//   onManageCollaborators,
  onClose,
}: PlaylistOptionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);

  useEffect(() => {
    console.log("Playlist dropdown mounted");
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
    <div className="absolute right-0 top-0 z-[9999]" ref={dropdownRef}>
      <div className="absolute right-0 top-full mt-2 min-w-[220px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Glass background overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-10 backdrop-blur-xl`}
        />
        <div className="absolute inset-0 bg-white/5" />

        <div className="relative z-10 py-2">
          {/* Play */}
          <Button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onPlay)}
          >
            <Play
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Play playlist
          </Button>

          {/* Shuffle */}
          <Button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onShuffle)}
          >
            <Shuffle
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Shuffle play
          </Button>

          {/* Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Add Songs */}
          <Button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onAddSongs)}
          >
            <Plus
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Add songs
          </Button>

          {/* Owner-only options */}
          {isOwner && (
            <>
              {/* Divider */}
              {/* <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" /> */}

              {/* Edit Details */}
              <Button
                className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
                onClick={() => handleOptionClick(onEdit)}
              >
                <Edit3
                  className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
                />
                Edit details
              </Button>

              {/* Rename */}
              {/* <button
                className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
                onClick={() => handleOptionClick(onRename)}
              >
                <Edit3
                  className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
                />
                Rename playlist
              </button> */}

              {/* Privacy Toggle */}
              {/* <button
                className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
                onClick={() => handleOptionClick(onTogglePublic)}
              >
                {isPublic ? (
                  <>
                    <Lock
                      className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
                    />
                    Make private
                  </>
                ) : (
                  <>
                    <Globe
                      className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
                    />
                    Make public
                  </>
                )}
              </button> */}

              {/* Collaborative Toggle */}
              {/* <button
                className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
                onClick={() => handleOptionClick(onToggleCollaborative)}
              >
                <Users
                  className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
                />
                {isCollaborative
                  ? "Disable collaboration"
                  : "Enable collaboration"}
              </button> */}

              {/* Manage Collaborators (only show if collaborative) */}
              {/* {isCollaborative && (
                <button
                  className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
                  onClick={() => handleOptionClick(onManageCollaborators)}
                >
                  <Users
                    className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
                  />
                  Manage collaborators
                </button>
              )} */}
            </>
          )}

          {/* Divider */}
          {/* <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" /> */}

          {/* Copy */}
          {/* <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onCopy)}
          >
            <Copy
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Duplicate playlist
          </button> */}

          {/* Share */}
          {/* <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onShare)}
          >
            <Share2
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Share playlist
          </button> */}

          {/* Download */}
          {/* <button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onDownload)}
          >
            <Download
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Download playlist
          </button> */}

          {/* Delete (only for owners) */}
          {isOwner && (
            <>
              {/* Divider */}
              <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <Button
                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 flex items-center gap-3 group"
                onClick={() => handleOptionClick(onDelete)}
              >
                <Trash2 className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
                Delete playlist
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
