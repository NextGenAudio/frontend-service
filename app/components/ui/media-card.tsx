"use client"

interface MediaCardProps {
  
  name: string;
  image?: string;
  count?: number;
  onClick?: () => void;
    type?: "folder" | "playlist";
}

function MediaCard({ name, image, count, onClick, type }: MediaCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer transition-all duration-300 shadow-lg"
    >
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover shadow-md"
      />
      <div className="flex-1 min-w-0 hidden sm:block">
        <div className="font-medium truncate text-white">{name}</div>
        {count !== undefined && (
          <div className="text-sm text-white/70">{count} songs</div>
        )}
      </div>
        <div className="text-sm text-white/70 capitalize">{type}</div>
    </div>
  );
}
export default MediaCard;