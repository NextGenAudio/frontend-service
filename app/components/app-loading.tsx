"use client"

import { useEffect, useState } from "react"
import { Music} from "lucide-react"
import { createPortal } from "react-dom"

export default function AppLoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

  }, [])

  return (
    typeof window !== "undefined" && createPortal(
      <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Main loading content */}
        <div className="relative z-[2147483647] flex flex-col items-center space-y-8 p-8">
          {/* Loading spinner */}
          <div className="relative">
            <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin">
              <div
                className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          {/* Sound waves animation */}
          <div className="flex items-end space-x-1 mt-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white/60 rounded-full animate-pulse"
                style={{
                  width: "4px",
                  height: `${20 + Math.random() * 30}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>,
      document.body
    )
  )
}
