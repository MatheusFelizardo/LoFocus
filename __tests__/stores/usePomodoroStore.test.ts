import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  usePomodoroStore,
  PomodoroStateEnum,
  PomodoroTypeEnum,
} from "@/app/stores/usePomodoro";

beforeEach(() => {
  usePomodoroStore.setState({
    isLoading: false,
    executionCounter: 0,
    timer: 25 * 60,
    type: PomodoroTypeEnum.POMODORO,
    status: PomodoroStateEnum.STOPPED,
    counter: null,
    logs: [],
    configuration: {
      timers: {
        [PomodoroTypeEnum.POMODORO]: 25 * 60,
        [PomodoroTypeEnum.SHORT_BREAK]: 5 * 60,
        [PomodoroTypeEnum.LONG_BREAK]: 15 * 60,
      },
      alarmSound: { value: "default", label: "Default" },
      longBreakInterval: 4,
    },
  });
});

describe("usePomodoroStore", () => {
  it("should start as STOPPED", () => {
    const { status } = usePomodoroStore.getState();
    expect(status).toBe(PomodoroStateEnum.STOPPED);
  });

  it("should change status to PLAYING", () => {
    const { setStatus } = usePomodoroStore.getState();
    setStatus(PomodoroStateEnum.PLAYING);
    expect(usePomodoroStore.getState().status).toBe(PomodoroStateEnum.PLAYING);
  });

  it("should decrement timer with setTimer", () => {
    const { setTimer } = usePomodoroStore.getState();
    setTimer(10);
    expect(usePomodoroStore.getState().timer).toBe(10 * 60);
  });

  it("should increment executionCounter", () => {
    const { increaseExecutionCounter } = usePomodoroStore.getState();
    increaseExecutionCounter();
    expect(usePomodoroStore.getState().executionCounter).toBe(1);
  });

  it("should reset executionCounter", () => {
    const { increaseExecutionCounter, resetExecutionCounter } =
      usePomodoroStore.getState();
    increaseExecutionCounter();
    resetExecutionCounter();
    expect(usePomodoroStore.getState().executionCounter).toBe(0);
  });

  it("should add log", () => {
    const { addLog } = usePomodoroStore.getState();
    addLog({
      action: PomodoroStateEnum.PLAYING,
      timestamp: new Date(),
      timeLeft: 1500,
      activity: PomodoroTypeEnum.POMODORO,
    });
    expect(usePomodoroStore.getState().logs).toHaveLength(1);
  });
});
