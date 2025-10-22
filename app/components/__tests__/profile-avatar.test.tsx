import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileAvatar from "../profile-avatar";
import { SidebarProvider } from "../../utils/sidebar-context";

describe("ProfileAvatar", () => {
  it("renders default avatar SVG when no image", () => {
    render(
      <SidebarProvider>
        <ProfileAvatar w={48} h={48} />
      </SidebarProvider>
    );
    // Lucide User icon renders as SVG, not <img>
    expect(screen.getByTestId("lucide-user-icon")).toBeInTheDocument();
  });

  it("renders profile image when userImage is present", () => {
    // Mock cookie to provide a userImage
    Object.defineProperty(document, "cookie", {
      writable: true,
      value:
        "sonex_user=" +
        encodeURIComponent(
          JSON.stringify({ User: { profileImageURL: "/test-image.jpg" } })
        ),
    });
    render(
      <SidebarProvider>
        <ProfileAvatar w={48} h={48} />
      </SidebarProvider>
    );
    // Next.js Image renders as <img> with alt="Profile"
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
  });
});
