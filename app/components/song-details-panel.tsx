"use client";

import { useState } from "react";
import { Heart, Share2, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";

interface Song {
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
}

interface SongDetailsPanelProps {
  song: Song;
}

export const SongDetailsPanel = ({ song }: SongDetailsPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 border-b border-border cursor-pointer hover:bg-hover-accent transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Now Playing</h2>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="flex-1 p-4">
          <div className="space-y-6">
            {/* Album Art */}
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{song.title}</div>
                <div className="text-sm text-muted-foreground">Album Art</div>
              </div>
            </div>
            
            {/* Song Info */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">{song.title}</h3>
              <p className="text-muted-foreground">{song.artist}</p>
              <p className="text-sm text-muted-foreground">{song.album}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                className={`hover:bg-hover-accent ${isLiked ? 'text-red-500' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-hover-accent">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-hover-accent">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Metadata */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-medium text-muted-foreground">meta data</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{song.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bitrate</span>
                  <span>320 kbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sample Rate</span>
                  <span>44.1 kHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Format</span>
                  <span>MP3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added</span>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};