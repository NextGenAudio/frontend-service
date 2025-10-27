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

// Mock next-auth to avoid importing ESM runtime in tests
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signOut: jest.fn(),
}));

import { render } from "@testing-library/react";
import { ProfileDropdown } from "../profile-dropdown";
import { ThemeProvider } from "@/app/utils/theme-context";

describe("ProfileDropdown", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider>
        <ProfileDropdown />
      </ThemeProvider>
    );
  });
});
