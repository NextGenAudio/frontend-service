import { render } from "@testing-library/react";
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
