// Integration test: render Sidebar + MusicPlayerHome together and assert navigation
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
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

// Prevent network calls and cookie access during mount
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock("js-cookie", () => ({
  get: jest.fn(() => undefined),
  set: jest.fn(),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../../sidebar";
import { MusicPlayerHome } from "../../music-player-home";
import { ThemeProvider } from "@/app/utils/theme-context";
import { SidebarProvider } from "@/app/utils/sidebar-context";
import { MusicProvider } from "@/app/utils/music-context";
import { EntityProvider } from "@/app/utils/entity-context";
import { EntityHandlingProvider } from "@/app/utils/entity-handling-context";

describe("App Integration — Sidebar + Home", () => {
  it("renders Sidebar and Home and navigates when Home clicked", () => {
    render(
      <MusicProvider>
        <SidebarProvider>
          <ThemeProvider>
            <EntityProvider>
              <EntityHandlingProvider>
                <div style={{ display: "flex" }}>
                  <Sidebar />
                  <main>
                    <MusicPlayerHome />
                  </main>
                </div>
              </EntityHandlingProvider>
            </EntityProvider>
          </ThemeProvider>
        </SidebarProvider>
      </MusicProvider>
    );

    // Basic smoke checks
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ready to discover your next favorite song\?/i)
    ).toBeInTheDocument();

    // Click the Home element in the sidebar and assert router.push was called
    const homeButton = screen.getByText(/Home/i);
    fireEvent.click(homeButton);
    expect(pushMock).toHaveBeenCalled();
  });
});
