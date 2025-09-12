import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const cookies = request.headers.get('cookie');

    // Call the music library service to fetch songs using the same method
    const response = await axios.get("http://localhost:8080/files/list", {
      headers: {
        'Authorization': authHeader,
        'Cookie': cookies,
      },
      withCredentials: true,
    });

    const songs = response.data;

    // Transform the data from music library service format to match the expected format for the playlist component
    const transformedSongs = songs?.map((song: any) => ({
      id: song.id.toString(),
      title: song.title || song.filename || 'Unknown Title',
      artist: song.artist || 'Unknown Artist',
      album: song.album || 'Unknown Album',
      duration: song.metadata?.track_length || 0,
      genre: song.metadata?.genre || 'Unknown',
      mood: song.metadata?.mood || 'Unknown',
      coverUrl: song.metadata?.cover_art || "/assets/marathondi-song.jpg",
      audioUrl: song.path || `/songs/${song.filename}`,
      uploadedAt: song.uploadedAt,
      userId: song.userId,
      folderId: song.folderId,
      filename: song.filename,
      path: song.path,
      metadata: song.metadata
    })) || [];

    console.log(`Fetched ${transformedSongs.length} songs from music library service`);
    return NextResponse.json(transformedSongs);
  } catch (error: any) {
    console.error('Music library service error:', error.response?.data || error.message);

    // If music library service is down, return empty array with appropriate error
    if (error.code === 'ECONNREFUSED') {
      console.error('Music library service is not running on port 8080');
      return NextResponse.json(
        { error: "Music library service unavailable", details: "Service is not running" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch songs from music library service", details: error.message },
      { status: 500 }
    );
  }
}
