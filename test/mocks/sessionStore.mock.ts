import { vi } from "vitest";

export function createSessionStoreMock(overrides = {}) {
  return {
    current: null,
    history: [],
    isLoading: false,
    error: null,
    loadSessions: vi.fn().mockResolvedValue(undefined),
    startSession: vi.fn().mockResolvedValue(undefined),
    incrementCycle: vi.fn().mockResolvedValue(undefined),
    finishSession: vi.fn().mockResolvedValue(undefined),
    finishIncompleteSession: vi.fn().mockResolvedValue(undefined),
    resetSession: vi.fn(),
    continueLastSession: vi.fn(),
    ...overrides,
  };
}
