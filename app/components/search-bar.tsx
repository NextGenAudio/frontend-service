"use client"

import { Search, Home, FolderOpen } from "lucide-react"
import { useState } from "react"

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className=" mx-4">
      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
        {/* Home Icon */}
        {/* <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
          <Home className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
        </button> */}

        {/* Search Section */}
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-10 h-10 text-white/50 p-2 rounded-lg bg-white/5" />
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg font-medium"
          />
        </div>

        {/* Library Icon */}
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
          <FolderOpen className="w-6 h-6 text-white/70 hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  )
}
