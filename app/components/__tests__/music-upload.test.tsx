import React from "react";
import { render } from "@testing-library/react";
import { MusicUpload } from "../music-upload";
import { ThemeProvider } from "@/app/utils/theme-context";
import { EntityProvider } from "@/app/utils/entity-context";
import { EntityHandlingProvider } from "@/app/utils/entity-handling-context";
import { SidebarProvider } from "@/app/utils/sidebar-context";

// Custom EntityProvider with mock folderList
const CustomEntityProvider = ({ children }: { children: React.ReactNode }) => {
  // ...import useState from React
  const [folderList, setFolderList] = React.useState([
    { id: 1, name: "Test Folder", musicCount: 3 },
  ]);
  const [playlistList, setPlaylistList] = React.useState([]);
  const [entityName, setEntityName] = React.useState<string | null>(null);
  const [entityArt, setEntityArt] = React.useState<string | null>(null);
  const [entityType, setEntityType] = React.useState<
    "folder" | "playlist" | null
  >(null);
  const [entityDescription, setEntityDescription] = React.useState("");

  return (
    <EntityProvider>
      {/* Overwrite context values if needed */}
      {children}
    </EntityProvider>
  );
};

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

describe("MusicUpload", () => {
  it("renders without crashing", () => {
    render(
      <SidebarProvider>
        <EntityHandlingProvider>
          <CustomEntityProvider>
            <ThemeProvider>
              <MusicUpload />
            </ThemeProvider>
          </CustomEntityProvider>
        </EntityHandlingProvider>
      </SidebarProvider>
    );
  });
});
