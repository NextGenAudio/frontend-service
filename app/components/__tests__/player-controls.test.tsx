import { render } from "@testing-library/react";
import { FloatingPlayerControls } from "@/app/components/player-controls";
import { MusicProvider, Song } from "@/app/utils/music-context";
import { Sidebar } from "lucide-react";
import { SidebarProvider } from "@/app/utils/sidebar-context";
import { ThemeProvider } from "@/app/utils/theme-context";

const songs: Song[] = [
  {
    id: "1",
    title: "Test Song 1",
    filename: "test1.mp3",
    artist: "Test Artist 1",
    album: "Test Album 1",
    path: "/music/test1.mp3",
    uploadedAt: new Date("2025-01-01"),
    lastListenedAt: null,
    musicArt: undefined,
    source: "local",
    metadata: {},
    liked: true,
    genre: "Pop",
    mood: "Happy",
    xscore: 10,
    yscore: 20,
    listenCount: 5,
    artworkURL: "https://example.com/art1.jpg",
  },
  {
    id: "2",
    title: "Test Song 2",
    filename: "test2.mp3",
    artist: "Test Artist 2",
    album: "Test Album 2",
    path: "/music/test2.mp3",
    uploadedAt: new Date("2025-01-02"),
    lastListenedAt: new Date("2025-01-10"),
    musicArt: undefined,
    source: "local",
    metadata: {},
    liked: false,
    genre: "Rock",
    mood: "Energetic",
    xscore: 15,
    yscore: 25,
    listenCount: 10,
    artworkURL: "https://example.com/art2.jpg",
  },
  {
    id: "3",
    title: "Test Song 3",
    filename: "test3.mp3",
    artist: "Test Artist 3",
    album: "Test Album 3",
    path: "/music/test3.mp3",
    uploadedAt: new Date("2025-01-03"),
    lastListenedAt: null,
    musicArt: undefined,
    source: "local",
    metadata: {},
    liked: true,
    genre: "Jazz",
    mood: "Calm",
    xscore: 20,
    yscore: 30,
    listenCount: 2,
    artworkURL: "https://example.com/art3.jpg",
  },
];

describe("PlayerControls", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider>
        <MusicProvider>
          <SidebarProvider>
            <FloatingPlayerControls
              song={songs[0]}
              handleNextClick={() => {}}
            />
          </SidebarProvider>
        </MusicProvider>
      </ThemeProvider>
    );
  });
});
