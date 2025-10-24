"use client";

import React, { useState, useEffect } from "react";

import {
  Eye,
  EyeOff,
  Music,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  User,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import jwt_decode from "jwt-decode";

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Redirect to player if already logged in
  useEffect(() => {
    const jwt = Cookies.get("sonex_token");
    if (jwt) {
      try {
        const decoded: any = jwt_decode(jwt);
        console.log("Decoded JWT:", decoded);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          // Cookies.remove("sonex_token");
        } else {
          setIsLoggedIn(true);
          router.push("/player/home");
        }
      } catch (e) {
        console.log("eerror", e);
        // If token is invalid, remove and redirect
        // Cookies.remove("sonex_token");
      }
    } else {
      // No JWT, redirect to login
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    if (isSignUp) {
      try {
        console.log("Signing up with:", {
          fullName,
          email,
          password,
          confirmPassword,
        });
        await axios.post(
          `${USER_MANAGEMENT_SERVICE_URL}/sonex/v1/auth/signup`,
          {
            firstName: fullName.split(" ")[0],
            lastName: fullName.split(" ").slice(1).join(" "),
            email: email,
            password: password,
            createdBy: "user",
          }
        );
        setShowEmailSent(true);
      } catch (err: any) {
        // Show backend error message if available
        if (err.response && err.response.data && err.response.data.error) {
          setLoginError(err.response.data.error);
        } else {
          setLoginError("An error occurred. Please try again.");
        }
        console.error("Signup error:", err.response || err);
      }
    } else {
      try {
        const res = await axios.post(
          `${USER_MANAGEMENT_SERVICE_URL}/sonex/v1/auth/login`,
          {
            email: email,
            password: password,
          }
        );
        console.log("Login response:", res);
        if (res.status === 200) {
          // Store response data in cookies
          Cookies.set("sonex_token", res.data.Access_Token, { expires: 7 });
          Cookies.set("sonex_user", JSON.stringify(res.data.User), {
            expires: 7,
          });
          router.push("/player/home");
        }
      } catch (err: any) {
        // Show error if 403
        if (err.response && err.response.status === 403) {
          setLoginError("Email or password is incorrect.");
        } else {
          setLoginError("An error occurred. Please try again.");
        }
        console.error("Login error:", err);
      }
    }
    setIsLoading(false);
  };

  if (showEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-10 max-w-md w-full text-center">
          <div className="flex flex-col items-center mb-6">
            <Mail className="w-16 h-16 text-orange-300 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Check your email
            </h2>
            <p className="text-white/80 text-lg">
              We've sent you an activation link. Please check your inbox and
              follow the instructions to activate your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Left Side - Player Image/Visualization */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        {/* Background overlay for content readability */}

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-300/30 rounded-full animate-bounce delay-300" />
          <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-amber-400/40 rounded-full animate-bounce delay-700" />
          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-orange-400/50 rounded-full animate-bounce delay-1100" />
        </div>

        <div className="relative z-10 text-center max-w-lg">
          {/* Welcome Content */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] mb-6 hover:scale-110 hover:rotate-3 transition-all duration-500 group">
                <Music className="w-12 h-12 text-orange-300 group-hover:text-orange-200 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-lg">
                SoneX
              </h1>
              <p className="text-orange-200/90 text-xl font-medium">
                {isSignUp
                  ? "Join the music revolution"
                  : "Welcome back to your music"}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 hover:bg-white/10 transition-all duration-300">
              <p className="text-white/95 text-xl leading-relaxed mb-4 font-light">
                Experience music like never before with SoundWave's
                revolutionary audio platform.
              </p>
              <p className="text-orange-200/80 text-lg">
                Join thousands of music lovers who have discovered their perfect
                sound.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-white/95 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-lg group-hover:shadow-orange-400/50"></div>
              <span className="font-medium">High-quality audio streaming</span>
            </div>
            <div className="flex items-center space-x-4 text-white/95 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group delay-100">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-lg group-hover:shadow-orange-400/50"></div>
              <span className="font-medium">Personalized playlists</span>
            </div>
            <div className="flex items-center space-x-4 text-white/95 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group delay-200">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-lg group-hover:shadow-orange-400/50"></div>
              <span className="font-medium">Social music sharing</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 max-w-md ml-52">
          {/* Auth Form */}
          <div className="bg-white/10  backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 hover:bg-white/15 transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-4 py-2 text-center text-sm font-medium mb-2">
                  {loginError}
                </div>
              )}
              {isSignUp && (
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-white/90 text-sm font-medium block"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-300/70" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-12 h-14 bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-white/90 text-sm font-medium block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-300/70" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-12 h-14 bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-white/90 text-sm font-medium block"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-300/70" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-14 bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-300/70 hover:text-orange-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-white/90 text-sm font-medium block"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-300/70" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-12 pr-12 h-14 bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:bg-white/15"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-300/70 hover:text-orange-300 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400/20 focus:ring-2"
                    />
                    <span className="text-white/80 text-sm group-hover:text-white transition-colors duration-200">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-orange-300 hover:text-orange-200 text-sm font-medium transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Auth Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
            </div>
            <div className="relative flex justify-center text-sm py-4">
              <span className="px-4 bg-white/10 backdrop-blur-xl text-white/70 rounded-full">
                Or continue with
              </span>
            </div>
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => signIn("spofity", { callbackUrl: "/" })}
                type="button"
                variant="outline"
                className="h-12 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Github className="w-5 h-5 mr-2" />
                Spotify
              </Button>
              <Button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                variant="outline"
                className="h-12 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>

            <div className="text-center mt-8">
              <p className="text-white/70">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-orange-300 hover:text-orange-200 font-medium transition-colors duration-200 hover:underline"
                >
                  {isSignUp ? "Sign in here" : "Sign up for free"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              By {isSignUp ? "creating an account" : "signing in"}, you agree to
              our{" "}
              <button className="text-orange-300/80 hover:text-orange-300 transition-colors duration-200 hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-orange-300/80 hover:text-orange-300 transition-colors duration-200 hover:underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
