"use client";

import React, { use, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../Tabs/TabPanel";
import {
  usePomodoroStore,
  PomodoroStateEnum,
  PomodoroTypeEnum,
} from "../../stores/usePomodoro";
import { Box, IconButton, Typography } from "@mui/material";
import {
  Circle,
  CircleOutlined,
  Pause,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import { BUCKET_URL } from "../Playlist/track";
import { useSessionStore } from "../../stores/useSessionStore";
import toast from "react-hot-toast";
import { handleChange, pauseTimer, startTimer, stopTimer } from "./utils";

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

const Circles = ({ current, max }: { current: number; max: number }) => {
  const circles = [];
  for (let i = 0; i < max; i++) {
    if (i < current) {
      circles.push(
        <Circle
          key={i}
          className="text-sm"
          style={{ color: "var(--text-color)" }}
        />
      );
    } else {
      circles.push(
        <CircleOutlined
          key={i}
          className="text-sm"
          style={{ color: "var(--text-color)" }}
        />
      );
    }
  }
  return <span className="flex items-center justify-center">{circles}</span>;
};

const Pomodoro = () => {
  const theme = useTheme();
  const { timer, type, status, setTimer, configuration, currentTab } =
    usePomodoroStore();
  const { current } = useSessionStore();

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

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="w-full flex flex-col items-center">
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => handleChange(newValue)}
            textColor="inherit"
            variant="fullWidth"
            className="w-full"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTabs-indicator": { backgroundColor: "var(--foreground)" },
              "& .MuiTab-root": {
                color: "var(--foreground)",
              },
            }}
          >
            <Tab label="Pomodoro" {...a11yProps(0)} />
            <Tab label="Short Break" {...a11yProps(1)} />
            <Tab label="Long Break" {...a11yProps(2)} />
          </Tabs>

          <TabPanel value={currentTab} index={0} dir={theme.direction}>
            <Box className="relative">
              {current && (
                <Typography className="text-sm absolute -top-8 left-1/2 -translate-x-1/2">
                  <Circles
                    current={current.cycles}
                    max={current.expectedCycles}
                  />
                </Typography>
              )}
              <Clock time={timer || 0} />
            </Box>
          </TabPanel>
          <TabPanel value={currentTab} index={1} dir={theme.direction}>
            <Clock time={timer || 0} />
          </TabPanel>
          <TabPanel value={currentTab} index={2} dir={theme.direction}>
            <Clock time={timer || 0} />
          </TabPanel>
        </div>

        <div
          id="controllers"
          className="flex justify-center items-center mt-8 relative w-full"
        >
          {status === PomodoroStateEnum.STOPPED ||
          status === PomodoroStateEnum.PAUSED ? (
            <IconButton
              className="p-1"
              style={{ color: "var(--play-icon)" }}
              onClick={() => startTimer()}
            >
              <PlayArrow className="w-20 h-20" />
            </IconButton>
          ) : (
            <IconButton
              className="p-1"
              style={{ color: "var(--pause-icon)" }}
              onClick={() => pauseTimer()}
            >
              <Pause className="w-20 h-20" />
            </IconButton>
          )}

          {status !== PomodoroStateEnum.STOPPED && (
            <IconButton
              className="p-1 absolute right-10"
              style={{ color: "var(--stop-icon)" }}
              onClick={() => stopTimer()}
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
