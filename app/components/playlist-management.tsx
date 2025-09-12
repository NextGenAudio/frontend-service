"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause,
  Music,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
  Heart,
  Share,
  Download,
  Shuffle,
  Sparkles
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { PlaylistCreate } from "./playlist-create";
import axios from "axios";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  genre: string;
  mood?: string;
  coverUrl?: string;
  audioUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  songs: Song[];
  isSmartPlaylist: boolean;
  aiGenerated: boolean;
  isPublic: boolean;
  genre?: string;
  mood?: string;
  createdAt: string;
  updatedAt: string;
  totalDuration: number;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface PlaylistManagementProps {
  currentUserId?: string;
}

export function PlaylistManagement({ currentUserId }: PlaylistManagementProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "my" | "public" | "ai" | "smart">("all");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    filterPlaylists();
  }, [playlists, searchQuery, filterType]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/playlists", {
        withCredentials: true,
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      setMessage({ text: "Failed to load playlists", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterPlaylists = () => {
    let filtered = playlists;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case "my":
        filtered = filtered.filter(playlist => playlist.owner.id === currentUserId);
        break;
      case "public":
        filtered = filtered.filter(playlist => playlist.isPublic);
        break;
      case "ai":
        filtered = filtered.filter(playlist => playlist.aiGenerated);
        break;
      case "smart":
        filtered = filtered.filter(playlist => playlist.isSmartPlaylist);
        break;
    }

    setFilteredPlaylists(filtered);
  };

  const handleDeletePlaylist = async (playlist: Playlist) => {
    try {
      await axios.delete(`http://localhost:8080/api/playlists/${playlist.id}`, {
        withCredentials: true,
      });

      setPlaylists(prev => prev.filter(p => p.id !== playlist.id));
      setMessage({ text: "Playlist deleted successfully", type: 'success' });
      setIsDeleteDialogOpen(false);
      setPlaylistToDelete(null);
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      setMessage({ text: "Failed to delete playlist", type: 'error' });
    }
  };

  const handleEditPlaylist = async (updatedPlaylist: Partial<Playlist>) => {
    if (!editingPlaylist) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/playlists/${editingPlaylist.id}`,
        updatedPlaylist,
        { withCredentials: true }
      );

      setPlaylists(prev =>
        prev.map(p => p.id === editingPlaylist.id ? { ...p, ...response.data } : p)
      );
      setMessage({ text: "Playlist updated successfully", type: 'success' });
      setIsEditDialogOpen(false);
      setEditingPlaylist(null);
    } catch (error) {
      console.error("Failed to update playlist:", error);
      setMessage({ text: "Failed to update playlist", type: 'error' });
    }
  };

  const handleDuplicatePlaylist = async (playlist: Playlist) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/playlists/${playlist.id}/duplicate`,
        {},
        { withCredentials: true }
      );

      setPlaylists(prev => [response.data, ...prev]);
      setMessage({ text: "Playlist duplicated successfully", type: 'success' });
    } catch (error) {
      console.error("Failed to duplicate playlist:", error);
      setMessage({ text: "Failed to duplicate playlist", type: 'error' });
    }
  };

  const handleRegenerateSmartPlaylist = async (playlist: Playlist) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/playlists/${playlist.id}/regenerate`,
        {},
        { withCredentials: true }
      );

      setPlaylists(prev =>
        prev.map(p => p.id === playlist.id ? response.data : p)
      );
      setMessage({ text: "Smart playlist regenerated successfully", type: 'success' });
    } catch (error) {
      console.error("Failed to regenerate playlist:", error);
      setMessage({ text: "Failed to regenerate playlist", type: 'error' });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
            My Playlists
          </h1>
          <p className="text-gray-400 mt-1">
            {filteredPlaylists.length} playlist{filteredPlaylists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <PlaylistCreate />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400"
          />
        </div>

        <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
          <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Playlists</SelectItem>
            <SelectItem value="my">My Playlists</SelectItem>
            <SelectItem value="public">Public Playlists</SelectItem>
            <SelectItem value="ai">AI Generated</SelectItem>
            <SelectItem value="smart">Smart Playlists</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={`${message.type === 'error' ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
          <AlertDescription className={message.type === 'error' ? 'text-red-400' : 'text-green-400'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Playlists Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
              <CardContent className="p-6">
                <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaylists.map((playlist) => (
            <Card key={playlist.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-0">
                {/* Playlist Cover */}
                <div className="relative aspect-square">
                  {playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-t-lg flex items-center justify-center">
                      <Music className="w-12 h-12 text-orange-400" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {playlist.aiGenerated && (
                      <Badge className="bg-purple-500/80 text-white text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                    {playlist.isSmartPlaylist && (
                      <Badge className="bg-blue-500/80 text-white text-xs">
                        Smart
                      </Badge>
                    )}
                    {playlist.isPublic && (
                      <Badge className="bg-green-500/80 text-white text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        {playlist.owner.id === currentUserId && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPlaylist(playlist);
                                setIsEditDialogOpen(true);
                              }}
                              className="text-white hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setPlaylistToDelete(playlist);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-400 hover:bg-gray-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDuplicatePlaylist(playlist)}
                          className="text-white hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {playlist.isSmartPlaylist && (
                          <DropdownMenuItem
                            onClick={() => handleRegenerateSmartPlaylist(playlist)}
                            className="text-white hover:bg-gray-700"
                          >
                            <Shuffle className="w-4 h-4 mr-2" />
                            Regenerate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Playlist Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Music className="w-3 h-3 mr-1" />
                      {playlist.songs.length} songs
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(playlist.totalDuration)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>by {playlist.owner.name}</span>
                    <span>{formatDate(playlist.createdAt)}</span>
                  </div>

                  {(playlist.genre || playlist.mood) && (
                    <div className="flex gap-1 mt-2">
                      {playlist.genre && (
                        <Badge variant="outline" className="text-xs">
                          {playlist.genre}
                        </Badge>
                      )}
                      {playlist.mood && (
                        <Badge variant="outline" className="text-xs">
                          {playlist.mood}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPlaylists.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No playlists found</h3>
          <p className="text-gray-400 mb-4">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first playlist to get started"
            }
          </p>
          {(!searchQuery && filterType === "all") && <PlaylistCreate />}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Playlist</DialogTitle>
          </DialogHeader>
          {editingPlaylist && (
            <EditPlaylistForm
              playlist={editingPlaylist}
              onSave={handleEditPlaylist}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Playlist</DialogTitle>
          </DialogHeader>
          {playlistToDelete && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete "{playlistToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeletePlaylist(playlistToDelete)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Playlist Form Component
interface EditPlaylistFormProps {
  playlist: Playlist;
  onSave: (updatedPlaylist: Partial<Playlist>) => void;
  onCancel: () => void;
}

function EditPlaylistForm({ playlist, onSave, onCancel }: EditPlaylistFormProps) {
  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description,
    isPublic: playlist.isPublic,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name" className="text-white">Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-description" className="text-white">Description</Label>
        <textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-gray-700 border-gray-600 text-white min-h-[100px] w-full rounded-md p-3 border"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-white hover:bg-gray-700">
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
