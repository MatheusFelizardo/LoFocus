import { create } from "zustand";

export enum PomodoroStateEnum {
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
  PLAYING = "playing",
  PAUSED = "paused",
  STOPPED = "stopped",
  FINISHED = "finished",
}

export enum PomodoroTypeEnum {
  POMODORO = "pomodoro",
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
}

export type LogEntry = {
  action: PomodoroStateEnum;
  timestamp: Date;
  timeLeft: number;
  activity: PomodoroTypeEnum;
};

export type PomodoroConfiguration = {
  timers: {
    [PomodoroTypeEnum.POMODORO]: number;
    [PomodoroTypeEnum.SHORT_BREAK]: number;
    [PomodoroTypeEnum.LONG_BREAK]: number;
  } | null;
  longBreakInterval: number;
  alarmSound: {
    label: string;
    value: string;
  };
};

type PomodoroState = {
  executionCounter: number;
  status: PomodoroStateEnum;
  type: PomodoroTypeEnum;
  timer: number | null;
  counter: NodeJS.Timeout | null;
  logs: LogEntry[];
  addLog: (entry: LogEntry) => void;
  setStatus: (status: PomodoroStateEnum) => void;
  setTimer: (time: number) => void;
  setType: (type: PomodoroTypeEnum) => void;
  setCounter: (counter: NodeJS.Timeout | null) => void;
  increaseExecutionCounter: () => void;
  resetExecutionCounter: () => void;
  isLoading: boolean;
  configuration: PomodoroConfiguration;
  setConfiguration: (config: PomodoroConfiguration) => void;
};

export const usePomodoroStore = create<PomodoroState>((set) => ({
  isLoading: true,
  executionCounter: 0,
  status: PomodoroStateEnum.STOPPED,
  type: PomodoroTypeEnum.POMODORO,
  timer: null,
  counter: null,
  logs: [],
  configuration: {
    timers: null,
    longBreakInterval: 4,
    alarmSound: {
      label: "Bell",
      value: "bell",
    },
  },
  addLog: (entry) => set((state) => ({ logs: [...state.logs, entry] })),
  setStatus: (status) => set(() => ({ status })),
  setTimer: (time) => set(() => ({ timer: time * 60 })),
  setType: (type) => set(() => ({ type })),
  setCounter: (counter) => set(() => ({ counter })),
  increaseExecutionCounter: () =>
    set(({ executionCounter }) => ({ executionCounter: executionCounter + 1 })),
  resetExecutionCounter: () => set(() => ({ executionCounter: 0 })),
  setConfiguration: (config) => set(() => ({ configuration: config })),
}));
