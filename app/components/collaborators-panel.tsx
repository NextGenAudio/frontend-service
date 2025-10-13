"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Users,
  UserPlus,
  Crown,
  Music,
  Heart,
  MoreHorizontal,
  X,
  Check,
  UserX,
  Settings,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { useSidebar } from "../utils/sidebar-context";

interface Collaborator {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  role: "owner" | "admin" | "editor" | "viewer";
  joinedAt: string;
  isOnline: boolean;
  lastActivity?: string;
  songsShared: number;
  playlistsShared: number;
}

export const CollaboratorsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<
    string | null
  >(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteUserId, setInviteUserId] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);
  const { setCollaborators: setSidebarCollaborators } = useSidebar();

  // Mock data for demonstration
  const mockCollaborators: Collaborator[] = [
    {
      id: "1",
      userId: "user123",
      username: "MusicLover_Alex",
      avatar: "/avatars/alex.jpg",
      role: "admin",
      joinedAt: "2024-01-15",
      isOnline: true,
      lastActivity: "2 minutes ago",
      songsShared: 45,
      playlistsShared: 8,
    },
    {
      id: "2",
      userId: "user456",
      username: "BeatMaster_Sam",
      role: "editor",
      joinedAt: "2024-02-10",
      isOnline: false,
      lastActivity: "1 hour ago",
      songsShared: 23,
      playlistsShared: 4,
    },
    {
      id: "3",
      userId: "user789",
      username: "SoundWave_Riley",
      role: "viewer",
      joinedAt: "2024-03-01",
      isOnline: true,
      lastActivity: "Just now",
      songsShared: 12,
      playlistsShared: 2,
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCollaborators([]);
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const filtered = mockCollaborators.filter(
        (collab) =>
          collab.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collab.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCollaborators(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleInviteCollaborator = async () => {
    if (!inviteUserId.trim()) return;

    // Simulate API call to invite user
    console.log("Inviting user:", inviteUserId);
    setInviteUserId("");
    setShowInviteForm(false);
    // You can add actual API call here
  };

  const getRoleIcon = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-400" />;
      case "admin":
        return <Settings className="h-3 w-3 text-purple-400" />;
      case "editor":
        return <Music className="h-3 w-3 text-blue-400" />;
      default:
        return <Users className="h-3 w-3 text-gray-400" />;
    }
  };

  const getRoleColor = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "admin":
        return "text-purple-400 bg-purple-400/20 border-purple-400/30";
      case "editor":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Glass background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-900/50 to-slate-900/50 backdrop-blur-xl" /> */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${themeColors.gradient} backdrop-blur-md shadow-lg`}
              >
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Collaborators
                </h2>
                <p className="text-xs text-white/60">
                  Find and manage team members
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setShowInviteForm(!showInviteForm)}
              className={`bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 text-white border-0 shadow-lg`}
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Invite
            </Button>
          </div>

          {/* Search Section */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 z-10 pointer-events-none" />
              <Input
                ref={searchInputRef}
                placeholder="Search by Username or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:border-white/40 transition-all duration-300"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-white/20 hover:bg-white/30 border-0 text-white"
              >
                {isSearching ? (
                  <div className="w-3 h-3 border border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {/* Invite Form */}
            {showInviteForm && (
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="h-4 w-4 text-white/70" />
                  <span className="text-sm font-medium text-white/90">
                    Invite New Collaborator
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter userId to invite..."
                    value={inviteUserId}
                    onChange={(e) => setInviteUserId(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  />
                  <Button
                    onClick={handleInviteCollaborator}
                    className="bg-green-500/80 hover:bg-green-500 text-white border-0"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => setShowInviteForm(false)}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {!searchQuery && (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Search className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <p className="text-white/80 font-medium">
                    Search for Collaborators
                  </p>
                  <p className="text-white/50 text-sm">
                    Enter a userId or username to find team members
                  </p>
                </div>
              </div>
            )}

            {searchQuery && collaborators.length === 0 && !isSearching && (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <UserX className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <p className="text-white/80 font-medium">
                    No Collaborators Found
                  </p>
                  <p className="text-white/50 text-sm">
                    Try searching with a different userId or username
                  </p>
                </div>
              </div>
            )}

            {collaborators.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70">
                    Found {collaborators.length} collaborator
                    {collaborators.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className={`p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer ${
                      selectedCollaborator === collaborator.id
                        ? "ring-2 ring-white/30"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCollaborator(
                        selectedCollaborator === collaborator.id
                          ? null
                          : collaborator.id
                      )
                    }
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {collaborator.avatar ? (
                            <img
                              src={collaborator.avatar}
                              alt={collaborator.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            collaborator.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        {collaborator.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white/20" />
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white truncate">
                            {collaborator.username}
                          </h3>
                          {getRoleIcon(collaborator.role)}
                        </div>
                        <p className="text-xs text-white/60 mb-2">
                          @{collaborator.userId}
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                              collaborator.role
                            )}`}
                          >
                            {collaborator.role}
                          </span>
                          <span className="text-xs text-white/50">
                            {collaborator.isOnline
                              ? "Online"
                              : collaborator.lastActivity}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <div className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            <span>{collaborator.songsShared} songs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>
                              {collaborator.playlistsShared} playlists
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {selectedCollaborator === collaborator.id && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-white/50">Joined:</span>
                            <p className="text-white/80">
                              {new Date(
                                collaborator.joinedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/50">Last Active:</span>
                            <p className="text-white/80">
                              {collaborator.lastActivity || "Unknown"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-500/80 hover:bg-blue-500 text-white border-0"
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
