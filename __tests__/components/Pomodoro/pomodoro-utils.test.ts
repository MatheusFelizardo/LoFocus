import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  startTimer,
  stopTimer,
  pauseTimer,
  handleChange,
} from "@/app/components/Pomodoro/utils";
import {
  usePomodoroStore,
  PomodoroStateEnum,
  PomodoroTypeEnum,
} from "@/app/stores/usePomodoro";

vi.useFakeTimers();

vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn() },
}));

vi.stubGlobal(
  "Audio",
  class {
    play = vi.fn();
    pause = vi.fn();
    currentTime = 0;
  }
);

describe("Pomodoro utils", () => {
  beforeEach(() => {
    usePomodoroStore.setState({
      isLoading: false,
      currentTab: 0,
      timer: 25 * 60,
      type: PomodoroTypeEnum.POMODORO,
      status: PomodoroStateEnum.STOPPED,
      executionCounter: 0,
      configuration: {
        timers: {
          [PomodoroTypeEnum.POMODORO]: 25,
          [PomodoroTypeEnum.SHORT_BREAK]: 5,
          [PomodoroTypeEnum.LONG_BREAK]: 15,
        },
        alarmSound: { value: "default", label: "Default" },
        longBreakInterval: 4,
      },
      logs: [],
      setCurrentTab: (ct) => usePomodoroStore.setState({ currentTab: ct }),
      setStatus: (s) => usePomodoroStore.setState({ status: s }),
      setTimer: (t) => usePomodoroStore.setState({ timer: t * 60 }),
      setCounter: (c) => usePomodoroStore.setState({ counter: c }),
      setType: (t) => usePomodoroStore.setState({ type: t }),
      increaseExecutionCounter: () =>
        usePomodoroStore.setState((s) => ({
          executionCounter: s.executionCounter + 1,
        })),
      resetExecutionCounter: () =>
        usePomodoroStore.setState({ executionCounter: 0 }),
      addLog: (log) =>
        usePomodoroStore.setState((s) => ({ logs: [...s.logs, log] })),
    } as any);
  });

  it("should set status to PLAYING and add log when startTimer is called", () => {
    startTimer();
    const { status, logs } = usePomodoroStore.getState();
    expect(status).toBe(PomodoroStateEnum.PLAYING);
    expect(logs.length).toBe(1);
  });

  it("should decrement timer when startTimer is called", () => {
    startTimer();
    expect(usePomodoroStore.getState().timer).toBe(25 * 60);
    vi.advanceTimersByTime(24 * 60 * 1000);
    const { timer } = usePomodoroStore.getState();
    expect(timer).toBe(60); // 1 minute left
  });

  it("should change the status to PAUSED when pauseTimer is called", () => {
    startTimer();
    pauseTimer();
    const { status } = usePomodoroStore.getState();
    expect(status).toBe(PomodoroStateEnum.PAUSED);
  });

  it("should reset the state when stopTimer is called", () => {
    startTimer();
    stopTimer();
    const { status, counter } = usePomodoroStore.getState();
    expect(status).toBe(PomodoroStateEnum.STOPPED);
    expect(counter).toBeNull();
  });

  it("should change the type to SHORT_BREAK and increment execution when handleChange is called", () => {
    handleChange(1);
    const { type, timer } = usePomodoroStore.getState();
    expect(type).toBe(PomodoroTypeEnum.SHORT_BREAK);
    expect(timer).toBe(5 * 60);
  });

  it("vai para Short Break após 1 pomodoro", () => {
    // First execution - from pomodoro 1 - Go to Short Break
    startTimer();
    vi.advanceTimersByTime(25 * 60 * 1000);
    const { currentTab, type, timer } = usePomodoroStore.getState();

    expect(currentTab).toBe(1); // Short break tab
    expect(type).toBe(PomodoroTypeEnum.SHORT_BREAK);
    expect(timer).toBe(5 * 60);

    // Second execution - Go to Pomodoro
    startTimer();
    vi.advanceTimersByTime(5 * 60 * 1000);
    const {
      currentTab: secondExecutionTab,
      type: secondExecutionType,
      timer: secondExecutionTimer,
    } = usePomodoroStore.getState();

    expect(secondExecutionTab).toBe(0); // Pomodoro tab
    expect(secondExecutionType).toBe(PomodoroTypeEnum.POMODORO);
    expect(secondExecutionTimer).toBe(25 * 60);

    // Third execution - From pomodoro 2 - Go to short Break
    startTimer();
    vi.advanceTimersByTime(25 * 60 * 1000);
    const {
      currentTab: thirdExecutionTab,
      type: thirdExecutionType,
      timer: thirdExecutionTimer,
    } = usePomodoroStore.getState();

    expect(thirdExecutionTab).toBe(1); // Short break
    expect(thirdExecutionType).toBe(PomodoroTypeEnum.SHORT_BREAK);
    expect(timer).toBe(5 * 60);

    // Fourth execution - Go to Pomodoro
    startTimer();
    vi.advanceTimersByTime(5 * 60 * 1000);
    const {
      currentTab: fourthExecutionTab,
      type: fourthExecutionType,
      timer: fourthExecutionTimer,
    } = usePomodoroStore.getState();

    expect(fourthExecutionTab).toBe(0); // Pomodoro tab
    expect(fourthExecutionType).toBe(PomodoroTypeEnum.POMODORO);
    expect(fourthExecutionTimer).toBe(25 * 60);

    // Fifth execution - From pomodoro 3 - Go to short Break
    startTimer();
    vi.advanceTimersByTime(25 * 60 * 1000);
    const {
      currentTab: fifthExecutionTab,
      type: fifthExecutionType,
      timer: fifthExecutionTimer,
    } = usePomodoroStore.getState();
    expect(fifthExecutionTab).toBe(1); // Short break
    expect(fifthExecutionType).toBe(PomodoroTypeEnum.SHORT_BREAK);
    expect(fifthExecutionTimer).toBe(5 * 60);

    // Sixth execution - Go to Pomodoro
    startTimer();
    vi.advanceTimersByTime(5 * 60 * 1000);
    const {
      currentTab: sixthExecutionTab,
      type: sixthExecutionType,
      timer: sixthExecutionTimer,
    } = usePomodoroStore.getState();
    expect(sixthExecutionTab).toBe(0); // Pomodoro tab
    expect(sixthExecutionType).toBe(PomodoroTypeEnum.POMODORO);
    expect(sixthExecutionTimer).toBe(25 * 60);

    // Seventh execution - From pomodoro 4 - Go to Long Break
    startTimer();
    vi.advanceTimersByTime(25 * 60 * 1000);
    const {
      currentTab: seventhExecutionTab,
      type: seventhExecutionType,
      timer: seventhExecutionTimer,
    } = usePomodoroStore.getState();
    expect(seventhExecutionTab).toBe(2); // Long break tab
    expect(seventhExecutionType).toBe(PomodoroTypeEnum.LONG_BREAK);
    expect(seventhExecutionTimer).toBe(15 * 60);

    // Eighth execution - Go to Pomodoro
    startTimer();
    vi.advanceTimersByTime(15 * 60 * 1000);
    const {
      currentTab: eighthExecutionTab,
      type: eighthExecutionType,
      timer: eighthExecutionTimer,
      executionCounter,
    } = usePomodoroStore.getState();

    expect(eighthExecutionTab).toBe(0); // Pomodoro tab
    expect(eighthExecutionType).toBe(PomodoroTypeEnum.POMODORO);
    expect(eighthExecutionTimer).toBe(25 * 60);
    expect(executionCounter).toBe(0);
  });
});
