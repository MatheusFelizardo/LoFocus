"use client";

import React, { use, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "./Tabs/TabPanel";
import {
  usePomodoroStore,
  PomodoroStateEnum,
  PomodoroTypeEnum,
} from "../stores/usePomodoro";
import { Button, IconButton, Typography } from "@mui/material";
import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import { BUCKET_URL } from "./Playlist/track";

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function format(ms: number) {
  const m = Math.floor(ms / 60)
    .toString()
    .padStart(2, "0");
  const s = (ms % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const Clock = ({ time }: { time: number }) => (
  <div id="regular-timer" className="text-6xl font-mono">
    <div className="text-9xl">{format(time)}</div>
  </div>
);

const Pomodoro = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const audio = new Audio(`${BUCKET_URL}/alarm/bell.mp3`);
  const AMOUNT_BEFORE_LONG_BREAK = 4;

  const {
    isLoading,
    executionCounter,
    timer,
    type,
    status,
    counter,
    setStatus,
    setTimer,
    setType,
    setCounter,
    increaseExecutionCounter,
    resetExecutionCounter,
    addLog,
    configuration,
    setConfiguration,
  } = usePomodoroStore();

  useEffect(() => {
    async function loadTimers() {
      //   const res = await fetch("/api/timers");
      //   const data = await res.json();
      usePomodoroStore.setState({ isLoading: false });

      const config = {
        timers: {
          [PomodoroTypeEnum.POMODORO]: 25 * 60,
          [PomodoroTypeEnum.SHORT_BREAK]: 5 * 60,
          [PomodoroTypeEnum.LONG_BREAK]: 15 * 60,
        },
        longBreakInterval: 4,
        alarmSound: {
          label: "Bell",
          value: "bell",
        },
      };

      setConfiguration(config);

      setTimer(config.timers[type]);
    }

    loadTimers();
  }, []);

  useEffect(() => {
    const typeCopy = {
      [PomodoroTypeEnum.POMODORO]: "🕒 Pomodoro",
      [PomodoroTypeEnum.SHORT_BREAK]: " ☕ Short Break",
      [PomodoroTypeEnum.LONG_BREAK]: " 💤 Long Break",
    };
    if (timer != null) {
      document.title = `${format(timer)} — LoFocus ${typeCopy[type]}`;
    } else {
      document.title = "LoFocus";
    }
    return () => {
      document.title = "LoFocus";
    };
  }, [timer, type]);

  useEffect(() => {
    if (configuration.timers !== null) {
      setTimer(configuration.timers[type]);
    }
  }, [configuration]);

  if (isLoading || configuration.timers === null || timer === null) {
    return <div>Carregando...</div>;
  }

  const startTimer = () => {
    if (isLoading || timer === null) return;

    setStatus(PomodoroStateEnum.PLAYING);
    const log = {
      action: PomodoroStateEnum.PLAYING,
      timestamp: new Date(),
      timeLeft: timer,
      activity: type,
    };
    console.log(log);
    addLog(log);

    const interval = setInterval(() => {
      usePomodoroStore.setState((state) => {
        if (state.timer === null || state.configuration.timers === null)
          return state;

        if (state.timer > 0) {
          return { ...state, timer: state.timer - 1 };
        }

        // Timer finished
        if (state.counter) clearInterval(state.counter);

        addLog({
          action: PomodoroStateEnum.FINISHED,
          timestamp: new Date(),
          timeLeft: 0,
          activity: state.type,
        });

        audio.play();
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 2000);

        let newExecutionCounter = state.executionCounter;
        let newType: PomodoroTypeEnum;

        if (state.type === PomodoroTypeEnum.POMODORO) {
          newExecutionCounter += 1;
          if (newExecutionCounter < AMOUNT_BEFORE_LONG_BREAK) {
            newType = PomodoroTypeEnum.SHORT_BREAK;
            setValue(1);
          } else {
            newType = PomodoroTypeEnum.LONG_BREAK;
            setValue(2);
            newExecutionCounter = 0;
          }
        } else {
          newType = PomodoroTypeEnum.POMODORO;
          setValue(0);
        }

        return {
          ...state,
          type: newType,
          timer: state.configuration.timers[newType],
          executionCounter: newExecutionCounter,
          status: PomodoroStateEnum.STOPPED,
          counter: null,
        };
      });
    }, 1000);

    setCounter(interval);
  };

  const stopTimer = () => {
    if (isLoading || timer === null || configuration.timers === null) return;
    setStatus(PomodoroStateEnum.STOPPED);
    if (counter) clearInterval(counter);
    setTimer(configuration.timers[type]);
    setCounter(null);

    const log = {
      action: PomodoroStateEnum.STOPPED,
      timestamp: new Date(),
      timeLeft: timer,
      activity: type,
    };
    console.log(log);
    addLog(log);
  };

  const pauseTimer = () => {
    if (isLoading || timer === null) return;
    setStatus(PomodoroStateEnum.PAUSED);
    if (counter) clearInterval(counter);
    setCounter(null);
    const log = {
      action: PomodoroStateEnum.PAUSED,
      timestamp: new Date(),
      timeLeft: timer,
      activity: type,
    };
    console.log(log);
    addLog(log);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (isLoading || configuration.timers === null || timer === null) return;
    if (status === PomodoroStateEnum.PLAYING && counter) clearInterval(counter);

    const initialType = type;
    const initialStatus = status;
    const newType =
      newValue === 0
        ? PomodoroTypeEnum.POMODORO
        : newValue === 1
        ? PomodoroTypeEnum.SHORT_BREAK
        : PomodoroTypeEnum.LONG_BREAK;

    setType(newType);
    setTimer(configuration.timers[newType]);
    setStatus(PomodoroStateEnum.STOPPED);
    setCounter(null);
    setValue(newValue);
    if (
      initialStatus === PomodoroStateEnum.PLAYING &&
      initialType === PomodoroTypeEnum.POMODORO
    ) {
      if (newType === PomodoroTypeEnum.SHORT_BREAK) {
        if (executionCounter + 1 < AMOUNT_BEFORE_LONG_BREAK) {
          increaseExecutionCounter();
        } else {
          resetExecutionCounter();
        }
      }

      if (newType === PomodoroTypeEnum.LONG_BREAK) {
        resetExecutionCounter();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-2xl">
        {/* <div>
          Pomodoro Component - Status: {status} | Time Left: {timer} | Actual
          Type: {type}
        </div> */}

        <div className="w-full flex flex-col items-center">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            variant="fullWidth"
            className="w-full"
          >
            <Tab label="Pomodoro" {...a11yProps(0)} />
            <Tab label="Short Break" {...a11yProps(1)} />
            <Tab label="Long Break" {...a11yProps(2)} />
          </Tabs>

          <TabPanel value={value} index={0} dir={theme.direction}>
            <Clock time={timer} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Clock time={timer} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Clock time={timer} />
          </TabPanel>
        </div>

        <div
          id="controllers"
          className="flex justify-center items-center mt-8 relative w-full"
        >
          {status === PomodoroStateEnum.STOPPED ||
          status === PomodoroStateEnum.PAUSED ? (
            <IconButton className="p-1 text-gray-400" onClick={startTimer}>
              <PlayArrow className="w-20 h-20" />
            </IconButton>
          ) : (
            <IconButton className="p-1 text-gray-400" onClick={pauseTimer}>
              <Pause className="w-20 h-20" />
            </IconButton>
          )}

          {status !== PomodoroStateEnum.STOPPED && (
            <IconButton
              className="p-1 text-red-400 absolute right-10"
              onClick={stopTimer}
            >
              <Stop className="w-12 h-12" />
              <Typography variant="caption">Stop</Typography>
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
};

export default Pomodoro;
