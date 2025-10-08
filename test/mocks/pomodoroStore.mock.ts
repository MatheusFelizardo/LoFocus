import { vi } from "vitest";

export function createPomodoroStoreMock(overrides = {}) {
  return {
    isLoading: false,
    executionCounter: 0,
    timer: 1500,
    type: "POMODORO",
    status: "STOPPED",
    counter: null,
    configuration: {
      timers: { POMODORO: 1500, SHORT_BREAK: 300, LONG_BREAK: 900 },
      alarmSound: { value: "bell" },
      longBreakInterval: 4,
    },
    setStatus: vi.fn(),
    setTimer: vi.fn(),
    setType: vi.fn(),
    setCounter: vi.fn(),
    increaseExecutionCounter: vi.fn(),
    resetExecutionCounter: vi.fn(),
    addLog: vi.fn(),
    ...overrides,
  };
}
