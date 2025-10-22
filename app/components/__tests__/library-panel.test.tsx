/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import { LibraryPanel } from "../library-panel";
import { SidebarProvider } from "@/app/utils/sidebar-context";
import { EntityProvider } from "@/app/utils/entity-context";
import { MusicProvider } from "@/app/utils/music-context";
import { EntityHandlingProvider } from "@/app/utils/entity-handling-context";

// 🧩 Mock the Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/mock-path",
  useSearchParams: () => new URLSearchParams(),
}));

describe("LibraryPanel", () => {
  it("renders without crashing", () => {
    render(
      <EntityHandlingProvider>
        <MusicProvider>
          <EntityProvider>
            <SidebarProvider>
              <LibraryPanel />
            </SidebarProvider>
          </EntityProvider>
        </MusicProvider>
      </EntityHandlingProvider>
    );
  });
});
