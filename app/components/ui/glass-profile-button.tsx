"use client"

import { Button } from "@radix-ui/themes"
import { User } from "lucide-react"
import { forwardRef } from "react"

interface GlassProfileButtonProps {
  onClick?: () => void
  className?: string
}

export const GlassProfileButton = forwardRef<HTMLButtonElement, GlassProfileButtonProps>(
  ({ onClick, className = "" }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        variant="ghost"
        className={`
          group w-10 h-10 rounded-full p-0 cursor-pointer
          bg-white/20 backdrop-blur-md border border-white/20 overflow-hidden 
          hover:scale-110 active:scale-95 transition-all duration-300 
          hover:bg-white/30 hover:border-white/30 hover:shadow-lg hover:shadow-orange-500/20
          focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
          ${className}
        `}
      >
        <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-300 transition-all duration-300">
          <User className="w-5 h-5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        </div>
      </Button>
    )
  },
)

GlassProfileButton.displayName = "GlassProfileButton"
