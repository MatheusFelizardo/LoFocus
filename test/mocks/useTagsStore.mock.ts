import { vi } from "vitest";

export function createTagsStoreMock(overrides = {}) {
  return {
    tags: [],
    isLoading: false,
    fetchTags: vi.fn().mockResolvedValue(undefined),
    addTag: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}
