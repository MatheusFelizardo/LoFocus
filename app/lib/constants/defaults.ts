import { PomodoroTypeEnum } from "@/app/lib/types";

export const DEFAULT_POMODORO_TIMERS = {
  [PomodoroTypeEnum.POMODORO]: 25,
  [PomodoroTypeEnum.SHORT_BREAK]: 5,
  [PomodoroTypeEnum.LONG_BREAK]: 15,
};

export const DEFAULT_LONG_BREAK_INTERVAL = 4;

export const DEFAULT_ALARM_SOUND = { label: "Bell", value: "bell" };

export const DEFAULT_THEME = "midnight";
