import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Path to public/songs folder
    const songsDir = path.join(process.cwd(), "public", "songs");

    // Read all files in folder
    const files = fs.readdirSync(songsDir);

    // Return as JSON
    return NextResponse.json({ files });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to read directory", details: error.message },
      { status: 500 }
    );
  }
}
