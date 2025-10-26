"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@radix-ui/themes"

const USER_MANAGEMENT_SERVICE_URL = process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL

export default function ActivatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [message, setMessage] = useState("Activating your account...")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!token) {
      setMessage("Invalid activation link.")
      setStatus("error")
      return
    }

    const activateAccount = async () => {
      try {
        await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/sonex/v1/auth/activate?token=${token}`)
        setMessage("Account activated successfully!")
        setStatus("success")
        // Redirect after success
        setTimeout(() => router.push("/login"), 3000)
      } catch (error: any) {
        setMessage("Activation failed. Please contact support." + (error.response?.data?.message ? `(${error.response.data.message})` : ""))
        setStatus("error")
      }
    }

    activateAccount()
  }, [token])

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-75"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-white/30">
                <svg className="w-10 h-10 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-red-400 bg-clip-text text-transparent mb-2">
              SoneX
            </h1>
            <p className="text-white/70 text-sm">Music Streaming Platform</p>
          </div>

          {/* Status Content */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              {status === "loading" && (
                <div className="relative w-16 h-16">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-spin"
                    style={{ animationDuration: "3s" }}
                  ></div>
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full"></div>
                </div>
              )}
              {status === "success" && (
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {status === "error" && (
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">
              {status === "loading" && "Activating Account"}
              {status === "success" && "Welcome!"}
              {status === "error" && "Activation Failed"}
            </h2>

            <p className="text-white/80 text-center text-base leading-relaxed">{message}</p>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => router.push("/login")}
            disabled={status === "loading"}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {status === "loading" ? "Activating..." : status === "success" ? "Go to Login" : "Try Again"}
          </Button>

          {/* Support Link */}
          <p className="text-center text-white/60 text-sm mt-6">
            Need help?{" "}
            <a href="/support" className="text-orange-400 hover:text-orange-300 transition-colors">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
