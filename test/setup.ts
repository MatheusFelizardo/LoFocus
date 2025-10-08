import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class MutationObserver {
  observe() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("ResizeObserver", ResizeObserver);
vi.stubGlobal("MutationObserver", MutationObserver);

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => ({
      get: () => null,
      entries: () => [].values(),
    }),
  };
});

vi.mock("next/headers", () => {
  return {
    headers: () => new Headers(),
    cookies: () => ({
      get: () => undefined,
      set: vi.fn(),
      delete: vi.fn(),
      getAll: () => [],
    }),
  };
});

vi.mock("next-auth/react", () => {
  return {
    useSession: () => ({ data: null, status: "unauthenticated" }),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

import React from "react";
vi.mock("react-howler", () => {
  const Mock = React.forwardRef<HTMLDivElement, any>((_props, _ref) => {
    return React.createElement("div", { "data-testid": "howler-mock" });
  });
  (Mock as any).howler = {
    duration: () => 60,
    seek: () => 0,
  };
  return { default: Mock };
});

Object.defineProperty(globalThis, "HTMLMediaElement", {
  value: class {
    play = vi.fn().mockResolvedValue(undefined);
    pause = vi.fn();
    load = vi.fn();
  },
});

(global as any).window ??= {} as any;
try {
  const url = new URL(window.location.href);
} catch {
  Object.defineProperty(window, "location", {
    value: new URL("http://localhost/"),
    writable: true,
  });
}
