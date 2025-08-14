import { Search, Bell, User, Settings } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export const SideBar = () => {
  return (
    <div className="fixed left-0  h-screen w-28 bg-slate-700 flex flex-col ">
      {/* Header */}
      <header className="bg-player-background border-b border-border flex items-center justify-between px-4 h-16 relative">
        {/* Logo */}


        {/* User Actions */}
        <div className="flex flex-col gap-2">
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

      

  
    </div>
  );
};
