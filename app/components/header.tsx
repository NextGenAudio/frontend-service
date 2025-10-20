"use client";

import React from "react";

import { Button } from "@/app/components/ui/button";
import { Music, ShieldUser } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ProfileAvatar from "../components/profile-avatar";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

const Header = () => {
  const { status, data: session } = useSession();
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, set_email] = useState("");

  useEffect(() => {
    const updateProfiles = async () => {
      if (session?.user?.email) {
        const result = await fetch(`/api/user?email=${session.user.email}`);
        const data = await result.json();
        set_first_name(data.data?.first_name);
        set_last_name(data.data?.last_name);
        set_email(data.data?.email);
        console.log("User data:", data.data);
        console.log("Session data:", session);
        if (!data.data) {
          const createResult = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: session.user.name!.split(" ")[0],
              last_name: session.user.name!.split(" ").slice(1).join(" "),
              email: session.user.email,
              password: "",
              image: session.user.image,
              created_at: new Date().toISOString(),
              created_by: "provider",
            }),
          });
          const createData = await createResult.json();
          console.log("Created user data:", createData);
        }
      }
    };
    updateProfiles();
  }, [session]);
  return (
    <div>
      <header className=" z-50 fixed top-0 left-0 right-0">
        <div className="bg-black/30 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">SoneX</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  About
                </a>
                <a
                  href="#download"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  Download
                </a>
                <a
                  href="#contact"
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                >
                  Contact
                </a>
              </div>
              {status === "unauthenticated" && (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border border-white/20 backdrop-blur-md shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform ">
                    Sign Up
                  </Button>
                </div>
              )}
              {status === "authenticated" && (
                <div className="flex items-center">
                  <div className="flex items-center space-x-8">
                    {session?.user?.name && (
                      <span className=" text-sm font-medium text-orange-400 tracking-wider uppercase bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
                        {session?.user?.name || first_name + " " + last_name}
                      </span>
                    )}
                    <ProfileAvatar w={12} h={12} />
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300"
                      >
                        <ShieldUser className="w-6 h-6" />
                        Admin
                      </Button>
                    </Link>

                    <Button
                      onClick={() => signOut()}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border border-white/20 backdrop-blur-md shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform "
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
