import { render } from "@testing-library/react";
import { CollaboratorsPanel } from "../collaborators-panel";
import { ThemeProvider } from "@/app/utils/theme-context";

describe("CollaboratorsPanel", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider>
        <CollaboratorsPanel />
      </ThemeProvider>
    );
  });
});
