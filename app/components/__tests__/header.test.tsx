// Mock Next.js router hooks used by components so tests can render
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

import { render } from "@testing-library/react";
import Header from "../header";

describe("Header", () => {
  it("renders without crashing", () => {
    render(<Header />);
  });
});
