import { render } from "@testing-library/react";
import { FolderOptionsDropdown } from "../folder-options-dropdown";
import { ThemeProvider } from "@/app/utils/theme-context";

describe("FolderOptionsDropdown", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider>
        <FolderOptionsDropdown folderId={1} folderName="Test Folder" />
      </ThemeProvider>
    );
  });
});
