import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";
import Credentials from "next-auth/providers/credentials";
import {createClient} from "@/app/utils/supabase/server";
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
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
      const supabase = await createClient();
      const { data, error } = await supabase
      .from("profiles") // case-sensitive table name
      .select("*")
      .eq("email", credentials.email)
      .eq("password", credentials.password)
      .single();
        if (data) {
          return data;
        }
        return null;
      },
    }),
  ],
  // You can add callbacks, pages, session strategies, etc.
 
});


// ✅ Export API route handlers (needed for App Router)
export const { GET, POST } = handlers;
