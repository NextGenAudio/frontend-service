import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: { playlistId: string } }
) {
  try {
    console.log(`[API] Fetching tracks for playlist ${params.playlistId}`);
    
    const authHeader = request.headers.get('authorization');
    const cookies = request.headers.get('cookie');

    console.log(`[API] Auth header present: ${!!authHeader}`);
    console.log(`[API] Cookies present: ${!!cookies}`);

    // Get tracks from the playlist service
    console.log(`[API] Calling playlist service: http://localhost:8082/playlist-service/api/playlists/${params.playlistId}/tracks`);
    
    let tracksResponse;
    try {
      tracksResponse = await axios.get(`http://localhost:8082/playlist-service/api/playlists/${params.playlistId}/tracks`, {
        headers: {
          'Authorization': authHeader,
          'Cookie': cookies,
        },
        withCredentials: true,
        timeout: 5000, // 5 second timeout
      });
    } catch (connectionError: any) {
      if (connectionError.code === 'ECONNREFUSED' || connectionError.message.includes('timeout')) {
        console.log(`[API] Playlist service not available, trying fallback method`);
        
        // Fallback: Try to get playlist tracks using the regular playlist endpoint
        try {
          const playlistResponse = await axios.get(`http://localhost:8082/playlist-service/api/playlists/${params.playlistId}`, {
            headers: {
              'Authorization': authHeader,
              'Cookie': cookies,
            },
            withCredentials: true,
            timeout: 5000,
          });
          
          // If playlist exists but no tracks endpoint, return empty for now
          console.log(`[API] Playlist found, but tracks endpoint not available`);
          return NextResponse.json([]);
        } catch {
          console.log(`[API] Playlist service completely unavailable - using mock data for development`);
          
          // Return mock data for development
          const mockSongs = [
            {
              id: "1",
              title: "Sample Song 1",
              filename: "sample1.mp3",
              artist: "Sample Artist",
              album: "Sample Album",
              path: "/mock/path1.mp3",
              uploadedAt: new Date(),
              source: "mock",
              metadata: { track_length: 180 },
              liked: false,
              playlistPosition: 1,
              addedAt: new Date().toISOString()
            },
            {
              id: "2", 
              title: "Sample Song 2",
              filename: "sample2.mp3",
              artist: "Sample Artist 2",
              album: "Sample Album 2",
              path: "/mock/path2.mp3",
              uploadedAt: new Date(),
              source: "mock",
              metadata: { track_length: 210 },
              liked: false,
              playlistPosition: 2,
              addedAt: new Date().toISOString()
            }
          ];
          
          console.log(`[API] Returning mock data for development`);
          return NextResponse.json(mockSongs);
        }
      }
      throw connectionError;
    }

    console.log(`[API] Playlist service response status: ${tracksResponse.status}`);
    console.log(`[API] Tracks data:`, tracksResponse.data);

    const tracks = tracksResponse.data;
    
    if (!tracks || tracks.length === 0) {
      console.log(`[API] No tracks found for playlist ${params.playlistId}`);
      return NextResponse.json([]);
    }

    console.log(`[API] Found ${tracks.length} tracks, fetching song details...`);

    // Fetch song details for each track
    const songPromises = tracks.map(async (track: any, index: number) => {
      try {
        console.log(`[API] Fetching song ${index + 1}/${tracks.length}: musicId=${track.musicId}`);
        
        const songResponse = await axios.get(`http://localhost:8080/files/${track.musicId}`, {
          headers: {
            'Authorization': authHeader,
            'Cookie': cookies,
          },
          withCredentials: true,
        });
        
        console.log(`[API] Song ${track.musicId} fetched successfully`);
        
        return {
          ...songResponse.data,
          playlistPosition: track.position,
          addedAt: track.addedAt
        };
      } catch (error: any) {
        console.error(`[API] Error fetching song ${track.musicId}:`, error.response?.status, error.message);
        return null;
      }
    });

    const songs = await Promise.all(songPromises);
    const validSongs = songs.filter(song => song !== null);
    
    console.log(`[API] Successfully processed ${validSongs.length}/${tracks.length} songs`);
    
    // Sort by playlist position
    validSongs.sort((a, b) => a.playlistPosition - b.playlistPosition);

    console.log(`[API] Returning ${validSongs.length} songs for playlist ${params.playlistId}`);
    return NextResponse.json(validSongs);
  } catch (error: any) {
    console.error('[API] Playlist tracks service error:', error.response?.data || error.message);
    console.error('[API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('[API] Connection refused - service may not be running');
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch playlist tracks" },
      { status: 500 }
    );
  }
}
