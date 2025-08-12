import { Search, Bell, User, Settings } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export const TopBar = () => {
  return (
    <div className="relative">
      <header className="h-14 bg-player-background border-b border-border flex items-center justify-between px-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search songs, playlists, artists..." 
            className="pl-10 bg-card border-border focus:border-primary"
          />
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text">
            SoneX
          </h1>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-hover-accent">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-hover-accent">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-hover-accent">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      {/* Polygon Header Shape */}
      <div className="h-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
        <svg 
          className="absolute bottom-0 left-0 w-full h-full" 
          preserveAspectRatio="none" 
          viewBox="0 0 1200 32"
        >
          <polygon 
            points="0,32 0,8 200,0 400,12 600,4 800,16 1000,8 1200,20 1200,32" 
            fill="url(#polygon-gradient)"
            className="opacity-60"
          />
          <defs>
            <linearGradient id="polygon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};