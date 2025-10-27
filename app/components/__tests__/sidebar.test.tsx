// Mock Next.js navigation hooks used by components so tests can render
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    route: "/",
    query: {},
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => ({ get: () => null }),
}));

// Prevent real network calls during component mount in tests
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

import { render } from "@testing-library/react";
import { Sidebar } from "../sidebar";
import { ThemeProvider } from "@/app/utils/theme-context";
import { SidebarProvider } from "@/app/utils/sidebar-context";
import { MusicProvider } from "@/app/utils/music-context";

// Sidebar uses ThemeProvider and SidebarProvider

describe("Sidebar", () => {
  it("renders without crashing", () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <Sidebar />
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );
  });
});
