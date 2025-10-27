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

import { render } from "@testing-library/react";
// Prevent network calls and cookie access during tests
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock("js-cookie", () => ({
  get: jest.fn(() => undefined),
  set: jest.fn(),
}));

import { MusicPlayerHome } from "../music-player-home";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@/app/utils/theme-context";
import { Sidebar } from "lucide-react";
import { SidebarProvider } from "@/app/utils/sidebar-context";
import { MusicProvider } from "@/app/utils/music-context";

describe("MusicPlayerHome", () => {
  it("renders without crashing", () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <MusicPlayerHome />
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );
  });
});
