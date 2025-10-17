import { Music } from "lucide-react";

interface EmptyLibraryPanelProps {
  message: string;
}

const EmptyLibraryPanel = ({ message }: EmptyLibraryPanelProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 opacity-50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
        <Music className="w-12 h-12 text-white/60" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>
    <p className="text-white/70 text-lg mb-6 max-w-md mx-16">
      Start by creating a folder or playlist to organize your music library.
    </p>
  </div>
);

export default EmptyLibraryPanel;
