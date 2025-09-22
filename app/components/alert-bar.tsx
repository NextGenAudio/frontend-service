import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const AlertBar = ({ message, setMessage } : { message: string, setMessage: React.Dispatch<React.SetStateAction<string | null>> }) => {
  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl transition-all duration-1000 ${
          message.includes("✅")
            ? "bg-green-500/20 border-green-400/30"
            : "bg-red-500/20 border-red-400/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-white text-center text-lg flex-1">{message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(null)}
            className="text-white hover:bg-white/10 ml-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertBar;
