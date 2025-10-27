// Integration test: render LibraryPanel with providers and assert playlists fetched and shown
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => ({ get: () => null }),
}));

const playlistsMock = [
  { id: 1, name: "Chill Vibes", description: "Relaxing tunes" },
  { id: 2, name: "Top Hits", description: "Popular tracks" },
];

jest.mock("axios", () => ({
  get: jest.fn((url: string) => {
    if (url && url.includes("playlist-service")) {
      return Promise.resolve({ data: playlistsMock });
    }
    return Promise.resolve({ data: [] });
  }),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

import { render, screen, waitFor } from "@testing-library/react";
import { LibraryPanel } from "../../library-panel";
import { SidebarProvider } from "@/app/utils/sidebar-context";
import { EntityProvider } from "@/app/utils/entity-context";
import { MusicProvider } from "@/app/utils/music-context";
import { EntityHandlingProvider } from "@/app/utils/entity-handling-context";
import { ThemeProvider } from "@/app/utils/theme-context";

describe("Integration — Library & Playlists", () => {
  it("fetches playlists and displays library header and playlists", async () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <EntityProvider>
              <EntityHandlingProvider>
                <LibraryPanel />
              </EntityHandlingProvider>
            </EntityProvider>
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );

    // Library header should be present — target the heading to avoid matching other 'Library' occurrences
    expect(
      screen.getByRole("heading", { name: /Your Library/i })
    ).toBeInTheDocument();

    // Wait for mocked playlists to be rendered (component may render them asynchronously)
    await waitFor(() => {
      expect(screen.getByText(/Chill Vibes/i)).toBeInTheDocument();
      expect(screen.getByText(/Top Hits/i)).toBeInTheDocument();
    });
  });
});
