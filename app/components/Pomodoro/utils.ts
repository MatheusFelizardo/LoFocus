import {
  usePomodoroStore,
  PomodoroStateEnum,
  PomodoroTypeEnum,
} from "@/app/stores/usePomodoro";
import { toast } from "react-hot-toast";
import { BUCKET_URL } from "../Playlist/track";
import { config } from "process";

const playAlarm = () => {
  if (typeof window !== "undefined") {
    const alarmSound = usePomodoroStore.getState().configuration.alarmSound;
    const route = `${BUCKET_URL}/alarm/${alarmSound.value}.mp3`;

    const audio = new Audio(route);
    audio.play();
  }
};

export const handleTimerEnd = () => {
  const {
    type: currentType,
    increaseExecutionCounter,
    resetExecutionCounter,
    executionCounter,
    configuration,
    addLog,
  } = usePomodoroStore.getState();

  addLog({
    action: PomodoroStateEnum.FINISHED,
    timestamp: new Date(),
    timeLeft: 0,
    activity: currentType,
  });

  playAlarm();
  toast.success(`${currentType} finalizado!`);

  if (currentType === PomodoroTypeEnum.POMODORO) {
    increaseExecutionCounter();

    const longBreakInterval = configuration.longBreakInterval || 4;
    const newCounter = executionCounter + 1;

    if (newCounter % longBreakInterval === 0) {
      handleChange(2); // Long Break
      resetExecutionCounter();
    } else {
      handleChange(1); // Short Break
    }
  } else {
    handleChange(0);
  }
};

export const startTimer = () => {
  const {
    status,
    setStatus,
    setCounter,
    addLog,
    timer,
    setTimer,
    configuration,
  } = usePomodoroStore.getState();

  if (timer === null) {
    const { configuration } = usePomodoroStore.getState();
    const pomodoroTime =
      configuration.timers?.[PomodoroTypeEnum.POMODORO] ?? 25;
    setTimer(pomodoroTime);
  }

  if (status !== PomodoroStateEnum.PLAYING) {
    setStatus(PomodoroStateEnum.PLAYING);

    if (status === PomodoroStateEnum.STOPPED) {
      addLog({
        action: PomodoroStateEnum.PLAYING,
        timestamp: new Date(),
        timeLeft: timer as number,
        activity: usePomodoroStore.getState().type,
      });
    }

    const interval = setInterval(() => {
      usePomodoroStore.setState((state) => {
        let newTimer = (state.timer || 0) - 1;

        if (newTimer <= 0) {
          stopTimer();
          handleTimerEnd();
          const { configuration: cfg, type: nextType } =
            usePomodoroStore.getState();
          return { timer: cfg.timers ? cfg.timers[nextType] * 60 : 0 };
        }

        return { timer: newTimer };
      });
    }, 1000);

    setCounter(interval);
  }
};

export const pauseTimer = () => {
  const { status, setStatus, counter, setCounter, addLog, timer, type } =
    usePomodoroStore.getState();

  if (status === PomodoroStateEnum.PLAYING && counter) {
    clearInterval(counter);
    setCounter(null);
    setStatus(PomodoroStateEnum.PAUSED);
    addLog({
      action: PomodoroStateEnum.PAUSED,
      timestamp: new Date(),
      timeLeft: timer as number,
      activity: type,
    });
  }
};

export const stopTimer = () => {
  const { counter, setCounter, setStatus, setCurrentTab } =
    usePomodoroStore.getState();

  if (counter) {
    clearInterval(counter);
  }

  setCounter(null);
  setStatus(PomodoroStateEnum.STOPPED);
  setCurrentTab(0);
};

export const handleChange = (tabIndex: number) => {
  const { setCurrentTab, setType, setTimer, configuration } =
    usePomodoroStore.getState();
  const timers = configuration.timers;
  if (!timers) return;

  setCurrentTab(tabIndex);

  let newType: PomodoroTypeEnum;
  let newTime: number;

  switch (tabIndex) {
    case 0:
      newType = PomodoroTypeEnum.POMODORO;
      newTime = timers[PomodoroTypeEnum.POMODORO];
      break;
    case 1:
      newType = PomodoroTypeEnum.SHORT_BREAK;
      newTime = timers[PomodoroTypeEnum.SHORT_BREAK];
      break;
    case 2:
      newType = PomodoroTypeEnum.LONG_BREAK;
      newTime = timers[PomodoroTypeEnum.LONG_BREAK];
      break;
    default:
      return;
  }

  console.log("Changing to", newType, "with time", newTime);

  setType(newType);
  setTimer(newTime);
};
