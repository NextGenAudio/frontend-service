import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";
// Optional: DB adapter
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
      Spotify({
      clientId: process.env.AUTH_SPOTIFY_ID!,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET!,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email user-read-private&response_type=token&show_dialog=true"
    })
  ],
  // You can add callbacks, pages, session strategies, etc.
 
});


// ✅ Export API route handlers (needed for App Router)
export const { GET, POST } = handlers;
