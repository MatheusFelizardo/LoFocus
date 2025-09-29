import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import {
  InfoOutline,
  Pause,
  PlayArrow,
  Stop,
  Timer,
} from "@mui/icons-material";
import {
  PomodoroConfiguration,
  PomodoroTypeEnum,
  usePomodoroStore,
} from "../stores/usePomodoro";

export const soundOptions = [
  { label: "Bell", value: "bell" },
  { label: "Digital Clock", value: "digital-clock" },
];

const ConfigModal = ({
  showConfig,
  setShowConfig,
}: {
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
}) => {
  const { configuration, setConfiguration } = usePomodoroStore();
  const { data: session } = useSession();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentSound, setCurrentSound] = React.useState<string | null>(null);

  const [newConfig, setNewConfig] = useState<PomodoroConfiguration>({
    timers: {
      [PomodoroTypeEnum.POMODORO]:
        configuration.timers?.[PomodoroTypeEnum.POMODORO] || 25,
      [PomodoroTypeEnum.SHORT_BREAK]:
        configuration.timers?.[PomodoroTypeEnum.SHORT_BREAK] || 5,
      [PomodoroTypeEnum.LONG_BREAK]:
        configuration.timers?.[PomodoroTypeEnum.LONG_BREAK] || 15,
    },
    longBreakInterval: configuration.longBreakInterval || 4,
    alarmSound: configuration.alarmSound || { label: "Bell", value: "bell" },
  });

  return (
    <Dialog
      open={showConfig}
      onClose={() => setShowConfig(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent dividers>
        <Box className="flex items-center gap-1 text-gray-500">
          <Typography>TIMER</Typography>

          <Timer className="w-5 h-5" />
          <span className="text-xs">(minutes)</span>
        </Box>

        <Box className="flex gap-2">
          <TextField
            fullWidth
            margin="normal"
            label="Pomodoro"
            type="number"
            defaultValue={configuration.timers?.[PomodoroTypeEnum.POMODORO]}
            onChange={(e) => {
              setNewConfig({
                ...newConfig,
                timers: {
                  [PomodoroTypeEnum.SHORT_BREAK]:
                    (newConfig.timers?.[PomodoroTypeEnum.SHORT_BREAK] || 5) *
                    60,
                  [PomodoroTypeEnum.LONG_BREAK]:
                    (newConfig.timers?.[PomodoroTypeEnum.LONG_BREAK] || 15) *
                    60,
                  [PomodoroTypeEnum.POMODORO]: parseInt(e.target.value) * 60,
                },
              });
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Short break"
            type="number"
            defaultValue={configuration.timers?.[PomodoroTypeEnum.SHORT_BREAK]}
            onChange={(e) => {
              setNewConfig({
                ...newConfig,
                timers: {
                  [PomodoroTypeEnum.POMODORO]:
                    (newConfig.timers?.[PomodoroTypeEnum.POMODORO] || 25) * 60,
                  [PomodoroTypeEnum.LONG_BREAK]:
                    (newConfig.timers?.[PomodoroTypeEnum.LONG_BREAK] || 15) *
                    60,
                  [PomodoroTypeEnum.SHORT_BREAK]: parseInt(e.target.value) * 60,
                },
              });
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Long break"
            type="number"
            defaultValue={configuration.timers?.[PomodoroTypeEnum.LONG_BREAK]}
            onChange={(e) => {
              setNewConfig({
                ...newConfig,
                timers: {
                  [PomodoroTypeEnum.POMODORO]:
                    (newConfig.timers?.[PomodoroTypeEnum.POMODORO] || 25) * 60,
                  [PomodoroTypeEnum.SHORT_BREAK]:
                    (newConfig.timers?.[PomodoroTypeEnum.SHORT_BREAK] || 5) *
                    60,
                  [PomodoroTypeEnum.LONG_BREAK]: parseInt(e.target.value) * 60,
                },
              });
            }}
          />
        </Box>
        <Box className="w-full flex gap-2 items-center mt-4">
          <TextField
            select
            label="Alarm sound"
            value={configuration.alarmSound.value}
            onChange={(e) => {
              setNewConfig({
                ...newConfig,
                alarmSound: {
                  label:
                    soundOptions.find((opt) => opt.value === e.target.value)
                      ?.label || "",
                  value: e.target.value,
                },
              });
            }}
            className="flex-1"
            slotProps={{
              select: {
                renderValue: (selected) => {
                  const option = soundOptions.find(
                    (opt) => opt.value === selected
                  );
                  return option ? option.label : "";
                },
              },
            }}
          >
            {soundOptions.map((option) => {
              const isCurrent = currentSound === option.value;

              return (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <IconButton
                    className="p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isCurrent && audio && !audio.paused) {
                        audio.pause();
                        setAudio(null);
                        setCurrentSound(null);
                        return;
                      }

                      if (audio) audio.pause();
                      const a = new Audio(`/audio/alarm/${option.value}.mp3`);
                      a.loop = true;
                      a.play();

                      setAudio(a);
                      setCurrentSound(option.value);
                    }}
                  >
                    {isCurrent && audio && !audio.paused ? (
                      <Stop className="w-4 h-4" />
                    ) : (
                      <PlayArrow className="w-4 h-4" />
                    )}
                  </IconButton>
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            fullWidth
            className="flex-1 m-0"
            margin="normal"
            label={
              <span className="flex items-center gap-1">
                Long break interval
                <Tooltip
                  placement="top"
                  title="The number of pomodoros before a long break is taken."
                >
                  <IconButton>
                    <InfoOutline className="w-4 h-4" />
                  </IconButton>
                </Tooltip>
              </span>
            }
            type="number"
            defaultValue={configuration.longBreakInterval}
            onChange={(e) =>
              setNewConfig({
                ...newConfig,
                longBreakInterval: parseInt(e.target.value),
              })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowConfig(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            setConfiguration(newConfig);
            setShowConfig(false);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigModal;
