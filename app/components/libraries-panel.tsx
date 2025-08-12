"use client"
import { useState } from "react";
import { Plus, ChevronDown, Music, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";

export const LibrariesPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const playlists = [
    { id: "1", name: "My Favorites", songCount: 42, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center" },
    { id: "2", name: "Chill Vibes", songCount: 28, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=center" },
    { id: "3", name: "Workout Mix", songCount: 35, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center" },
    { id: "4", name: "Road Trip", songCount: 23, image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=100&h=100&fit=crop&crop=center" },
    { id: "5", name: "Study Session", songCount: 19, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center" }
  ];

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 border-b border-border cursor-pointer hover:bg-hover-accent transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Libraries</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-primary/20">
                  <Plus className="h-3 w-3" />
                </Button>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="flex-1">
          <Tabs defaultValue="playlists" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-2 bg-muted">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
              <TabsTrigger value="playlists" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Playlists</TabsTrigger>
              <TabsTrigger value="imports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Imports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="flex-1 px-2">
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-hover-accent cursor-pointer transition-colors group"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={playlist.image} 
                        alt={playlist.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    </div>
                    <div className="flex-1 min-w-0 hidden sm:block">
                      <div className="font-medium truncate">{playlist.name}</div>
                      <div className="text-sm text-muted-foreground">{playlist.songCount} songs</div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-hover-accent hidden sm:flex">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {["Local Files", "Downloaded"].map((item, index) => (
                  <div
                    key={`special-${index}`}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-hover-accent cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium hidden sm:block">{item}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="playlists" className="flex-1 px-2">
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-hover-accent cursor-pointer transition-colors group"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={playlist.image} 
                        alt={playlist.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    </div>
                    <div className="flex-1 min-w-0 hidden sm:block">
                      <div className="font-medium truncate">{playlist.name}</div>
                      <div className="text-sm text-muted-foreground">{playlist.songCount} songs</div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-hover-accent hidden sm:flex">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="imports" className="flex-1 px-2">
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg hover:bg-hover-accent cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Spotify Import</div>
                  <div className="text-xs text-muted-foreground">Last synced 2 days ago</div>
                </div>
                <div className="p-3 bg-muted rounded-lg hover:bg-hover-accent cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Apple Music</div>
                  <div className="text-xs text-muted-foreground">Last synced 1 week ago</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};