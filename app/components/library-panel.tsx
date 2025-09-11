"use client";
import { useEffect, useState } from "react";
import { Plus, Music, MoreHorizontal, FolderPlus, ListMusic, Upload } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/app/components/ui/dropdown-menu";
import { useSidebar } from "../utils/sidebar-context";

type Folder = {
  id: number;
  name: string;
  description?: string;
  folderArt?: string; // comes from DB
  musicCount?: number;
};

interface Song {
  id: string;
  title: string | undefined;
  filename: string;

  artist: string | undefined;
  album: string | undefined;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  // isLiked: boolean;
}

export const LibraryPanel = () => {
  const { setUpload, setHome, setCreateFolder, setCreatePlaylist } = useSidebar();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("http://localhost:8080/folders", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched folders:", data);
        setFolders(data);
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };
    fetchFolders();
  }, []);

  // Handle folder click
  const handleFolderClick = async (folder: Folder) => {
    setSelectedFolder(folder);
    try {
      const res = await fetch(`http://localhost:8080/files/list?folderId=${folder.id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("Songs in folder:", data);
      setSongs(data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  const playlists = [
    {
      id: "1",
      name: "My Favorites",
      songCount: 42,
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: "2",
      name: "Chill Vibes",
      songCount: 28,
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=center",
    },
  ];

  const defaultImage = "/placeholder.svg";

  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-slate-800/80 to-gray-900/90"></div>
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10"></div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="p-4 pt-6 border-b border-white/20 cursor-pointer backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl ml-3 font-semibold text-white drop-shadow-sm">
              Your Library
            </h2>
            <div className="flex items-center gap-2">
              {/* Dropdown Menu for all actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800/95 backdrop-blur-xl border-gray-700/50 shadow-xl">
                  <DropdownMenuItem
                    onClick={() => setCreatePlaylist(true)}
                    className="text-white hover:bg-gray-700/50 cursor-pointer"
                  >
                    <ListMusic className="w-4 h-4 mr-2" />
                    Create Playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCreateFolder(true)}
                    className="text-white hover:bg-gray-700/50 cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create Folder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700/50" />
                  <DropdownMenuItem
                    onClick={() => setUpload(true)}
                    className="text-white hover:bg-gray-700/50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Music
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="playlists" className="h-full flex flex-col">
            <TabsList className="bg-transparent border-b border-white/20 rounded-none p-0 h-auto">
              <TabsTrigger
                value="playlists"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-400 px-4 py-2"
              >
                Playlists
              </TabsTrigger>
              <TabsTrigger
                value="folders"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-400 px-4 py-2"
              >
                Folders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playlists" className="flex-1 overflow-y-auto mt-0">
              <div className="p-4 space-y-3">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                      <img
                        src={playlist.image || defaultImage}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate drop-shadow-sm">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-white/70 truncate">
                        {playlist.songCount} songs
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-4 w-4 text-white/70" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="folders" className="flex-1 overflow-y-auto mt-0">
              <div className="p-4 space-y-3">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group backdrop-blur-sm border bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] hover:shadow-lg"
                    onClick={() => handleFolderClick(folder)}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 flex items-center justify-center">
                      {folder.folderArt ? (
                        <img
                          src={folder.folderArt}
                          alt={folder.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="w-6 h-6 text-white/70" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate drop-shadow-sm">
                        {folder.name}
                      </h3>
                      <p className="text-sm text-white/70 truncate">
                        {folder.description || "No description"}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-4 w-4 text-white/70" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
