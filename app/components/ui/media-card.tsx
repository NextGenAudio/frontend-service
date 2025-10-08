"use client";

import Image from "next/image";
import { Button } from "./button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { FolderOptionsDropdown } from "../folder-options-dropdown";
import { PlaylistOptionsDropdown } from "../playlist-options-dropdown";

interface MediaCardProps {
  id: number;
  name: string;
  image?: string;
  count?: number;
  onClick?: () => void;
  type?: "folder" | "playlist";
  isActive?: boolean; // Add this prop to track active state
  // Folder-specific props
  onFolderOpen?: () => void;
  onFolderRename?: () => void;
  onFolderDelete?: () => void;
  onFolderShare?: () => void;
  onFolderCopy?: () => void;
  onFolderMove?: () => void;
  onFolderDownload?: () => void;
  onCreateSubfolder?: () => void;
  // Playlist-specific props
  isOwner?: boolean;
  isLiked?: boolean;
  isPublic?: boolean;
  isCollaborative?: boolean;
  onPlaylistPlay?: () => void;
  onPlaylistShuffle?: () => void;
  onPlaylistAddSongs?: () => void;
  onPlaylistEdit?: () => void;
  onPlaylistRename?: () => void;
  onPlaylistCopy?: () => void;
  onPlaylistDelete?: () => void;
  onPlaylistShare?: () => void;
  onPlaylistDownload?: () => void;
  onPlaylistToggleLike?: () => void;
  onPlaylistTogglePublic?: () => void;
  onPlaylistToggleCollaborative?: () => void;
  onPlaylistManageCollaborators?: () => void;
}

function MediaCard({
  id,
  name,
  image,
  count,
  onClick,
  type,
  isActive = false, // Add default value
  // Folder props
  onFolderOpen,
  onFolderRename,
  onFolderDelete,
  onFolderShare,
  onFolderCopy,
  onFolderMove,
  onFolderDownload,
  onCreateSubfolder,
  // Playlist props
  isOwner = true,
  isLiked = false,
  isPublic = false,
  isCollaborative = false,
  onPlaylistPlay,
  onPlaylistShuffle,
  onPlaylistAddSongs,
  onPlaylistEdit,
  onPlaylistRename,
  onPlaylistCopy,
  onPlaylistDelete,
  onPlaylistShare,
  onPlaylistDownload,
  onPlaylistToggleLike,
  onPlaylistTogglePublic,
  onPlaylistToggleCollaborative,
  onPlaylistManageCollaborators,
}: MediaCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border cursor-pointer shadow-lg group relative transition-all duration-300 ${
        isActive
          ? "bg-white/25 border-white/40 shadow-xl" // Active state styling
          : "bg-white/10 border-white/20 hover:bg-white/20" // Default state styling
      } ${showDropdown ? "z-[10000]" : "z-10"}`}
    >
      <Image
        src={image || "/assets/file-icon.webp"}
        alt={name || "Media"}
        className="w-12 h-12 rounded-xl object-cover shadow-md"
        width={48}
        height={48}
      />
      <div className="flex-1 min-w-0 hidden sm:block">
        <div className="font-medium truncate text-white">{name}</div>
        {count !== undefined && (
          <div className="text-sm text-white/70">{count} songs</div>
        )}
      </div>
      <div className="text-sm text-white/70 capitalize">{type}</div>
      <div className="relative">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm relative z-10"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
        >
          <MoreHorizontal className="h-3 w-3 text-white/70" />
        </Button>

        {/* Dropdown Components */}
        {showDropdown && type === "folder" && (
          <FolderOptionsDropdown
            folderId={id}
            folderName={name}
            onOpen={onFolderOpen}
            onRename={onFolderRename}
            onDelete={onFolderDelete}
            // onShare={onFolderShare}
            // onCopy={onFolderCopy}
            // onMove={onFolderMove}
            // onDownload={onFolderDownload}
            // onCreateSubfolder={onCreateSubfolder}
            onClose={() => setShowDropdown(false)}
          />
        )}

        {showDropdown && type === "playlist" && (
          <PlaylistOptionsDropdown
            playlistId={id}
            playlistName={name}
            isOwner={isOwner}
            isLiked={isLiked}
            isPublic={isPublic}
            isCollaborative={isCollaborative}
            onPlay={onPlaylistPlay}
            onShuffle={onPlaylistShuffle}
            onAddSongs={onPlaylistAddSongs}
            onEdit={onPlaylistEdit}
            // onRename={onPlaylistRename}
            // onCopy={onPlaylistCopy}
            onDelete={onPlaylistDelete}
            // onShare={onPlaylistShare}
            // onDownload={onPlaylistDownload}
            // onToggleLike={onPlaylistToggleLike}
            // onTogglePublic={onPlaylistTogglePublic}
            // onToggleCollaborative={onPlaylistToggleCollaborative}
            // onManageCollaborators={onPlaylistManageCollaborators}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>
    </div>
  );
}
export default MediaCard;
