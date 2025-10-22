import { render } from "@testing-library/react";
import AudioVisualizer from "../audio-visualizer";
import { MusicProvider } from "@/app/utils/music-context";
import { ThemeProvider } from "@/app/utils/theme-context";

describe("AudioVisualizer", () => {
  it("renders without crashing", () => {
    render(
        <ThemeProvider>
        <MusicProvider>
          <AudioVisualizer />
        </MusicProvider>
      </ThemeProvider>
    );
  });
});
