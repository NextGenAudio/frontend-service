import { render } from "@testing-library/react";
import { ProfileUpdatePanel } from "../profile-update-panel";
import { ThemeProvider } from "@/app/utils/theme-context";
import { SidebarProvider } from "@/app/utils/sidebar-context";

const mockProfile = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  role: { roleName: "user" },
  artistName: "",
  artistGenre: "",
  artistBio: "Music lover and artist",
  location: "New York, USA",
  website: "https://example.com",
  instagram: "@johndoe",
  youtube: "@johndoe",
  spotify: "spotify:user:johndoe", // or 'artist' if you want to test artist fields
};

describe("ProfileUpdatePanel", () => {
  it("renders without crashing", () => {
    render(
      <SidebarProvider>
        <ThemeProvider>
          <ProfileUpdatePanel profile={mockProfile} />
        </ThemeProvider>
      </SidebarProvider>
    );
  });
});
