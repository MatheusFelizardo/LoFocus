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
  selectedTheme?: string;
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
  loadProfile: () => Promise<void>;
  saveProfile: (newConfig: PomodoroConfiguration) => Promise<void>;
  currentTab: number;
  setCurrentTab: (currentTab: number) => void;
};

export const usePomodoroStore = create<PomodoroState>((set) => ({
  isLoading: true,
  currentTab: 0,
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
  setCurrentTab: (currentTab) => set(() => ({ currentTab })),
  setStatus: (status) => set(() => ({ status })),
  setTimer: (time) => set(() => ({ timer: time * 60 })),
  setType: (type) => set(() => ({ type })),
  setCounter: (counter) => set(() => ({ counter })),
  increaseExecutionCounter: () =>
    set(({ executionCounter }) => ({ executionCounter: executionCounter + 1 })),
  resetExecutionCounter: () => set(() => ({ executionCounter: 0 })),
  setConfiguration: (config) => set(() => ({ configuration: config })),
  loadProfile: async () => {
    try {
      const res = await fetch("/api/userProfile");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();

      if (!data) {
        const configuration = {
          timers: {
            [PomodoroTypeEnum.POMODORO]: 25,
            [PomodoroTypeEnum.SHORT_BREAK]: 5,
            [PomodoroTypeEnum.LONG_BREAK]: 15,
          },
          longBreakInterval: 4,
          alarmSound: { label: "Bell", value: "bell" },
          selectedTheme: "midnight",
        };
        await usePomodoroStore.getState().saveProfile(configuration);
        set(() => ({
          configuration,
          timer: 25 * 60,
          isLoading: false,
        }));
        return;
      }

      const configuration = {
        timers: {
          [PomodoroTypeEnum.POMODORO]: data.defaultPomodoro,
          [PomodoroTypeEnum.SHORT_BREAK]: data.defaultShortBreak,
          [PomodoroTypeEnum.LONG_BREAK]: data.defaultLongBreak,
        },
        longBreakInterval: data.longBreakInterval,
        alarmSound: {
          label:
            data.defaultAlarmSound.charAt(0).toUpperCase() +
            data.defaultAlarmSound.slice(1),
          value: data.defaultAlarmSound,
        },
        selectedTheme: data.selectedTheme || "midnight",
      };
      console.log("Loaded configuration:", configuration);
      set(() => ({
        configuration,
        timer: configuration.timers[PomodoroTypeEnum.POMODORO],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  },
  saveProfile: async (newConfig: PomodoroConfiguration) => {
    try {
      const config = newConfig;
      if (!config.timers) throw new Error("No timers configured");
      const res = await fetch("/api/userProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultPomodoro: config.timers[PomodoroTypeEnum.POMODORO],
          defaultShortBreak: config.timers[PomodoroTypeEnum.SHORT_BREAK],
          defaultLongBreak: config.timers[PomodoroTypeEnum.LONG_BREAK],
          longBreakInterval: config.longBreakInterval,
          defaultAlarmSound: config.alarmSound.value,
          selectedTheme: config.selectedTheme,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const response = await res.json();

      set(() => ({
        configuration: {
          longBreakInterval: response.longBreakInterval,
          timers: {
            [PomodoroTypeEnum.POMODORO]: response.defaultPomodoro,
            [PomodoroTypeEnum.SHORT_BREAK]: response.defaultShortBreak,
            [PomodoroTypeEnum.LONG_BREAK]: response.defaultLongBreak,
          },
          alarmSound: {
            label:
              response.defaultAlarmSound.charAt(0).toUpperCase() +
              response.defaultAlarmSound.slice(1),
            value: response.defaultAlarmSound,
          },
          selectedTheme: response.selectedTheme || "midnight",
        },
      }));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  },
}));
