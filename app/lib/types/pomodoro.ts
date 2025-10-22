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
