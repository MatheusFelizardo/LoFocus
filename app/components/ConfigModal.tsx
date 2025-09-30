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
import { BUCKET_URL } from "./Playlist/track";
import toast from "react-hot-toast";

export const soundOptions = [
  { label: "Bell", value: "bell" },
  { label: "Digital Clock", value: "digital-clock" },
  { label: "Kitchen Timer", value: "kitchen" },
];

const ConfigModal = ({
  showConfig,
  setShowConfig,
}: {
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
}) => {
  const { configuration, saveProfile } = usePomodoroStore();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentSound, setCurrentSound] = React.useState<string | null>(null);

  const [newConfig, setNewConfig] =
    useState<PomodoroConfiguration>(configuration);

  const handleSave = async () => {
    const isValid =
      (newConfig.timers?.[PomodoroTypeEnum.POMODORO] || 0) > 0 &&
      (newConfig.timers?.[PomodoroTypeEnum.SHORT_BREAK] || 0) > 0 &&
      (newConfig.timers?.[PomodoroTypeEnum.LONG_BREAK] || 0) > 0 &&
      (newConfig.longBreakInterval || 0) > 0;
    if (!isValid) {
      toast.error("All fields must be greater than zero.");
      return;
    }

    await saveProfile(newConfig);
    setShowConfig(false);
  };

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
            type="text"
            value={newConfig.timers?.[PomodoroTypeEnum.POMODORO]}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              const value = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);

              setNewConfig({
                ...newConfig,
                timers: {
                  [PomodoroTypeEnum.SHORT_BREAK]:
                    newConfig.timers?.[PomodoroTypeEnum.SHORT_BREAK] || 0,
                  [PomodoroTypeEnum.LONG_BREAK]:
                    newConfig.timers?.[PomodoroTypeEnum.LONG_BREAK] || 0,
                  [PomodoroTypeEnum.POMODORO]: value,
                },
              });
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Short break"
            type="text"
            value={newConfig.timers?.[PomodoroTypeEnum.SHORT_BREAK]}
            onChange={(e) => {
              console.log(e.target.value);
              const onlyDigits = e.target.value.replace(/\D/g, "");
              const value = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);

              setNewConfig({
                ...newConfig,
                timers: {
                  [PomodoroTypeEnum.POMODORO]:
                    newConfig.timers?.[PomodoroTypeEnum.POMODORO] || 0,
                  [PomodoroTypeEnum.LONG_BREAK]:
                    newConfig.timers?.[PomodoroTypeEnum.LONG_BREAK] || 0,
                  [PomodoroTypeEnum.SHORT_BREAK]: value,
                },
              });
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Long break"
            type="text"
            value={newConfig.timers?.[PomodoroTypeEnum.LONG_BREAK]}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              const value = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);
              setNewConfig({
                ...newConfig,
                timers: {
                  [PomodoroTypeEnum.POMODORO]:
                    newConfig.timers?.[PomodoroTypeEnum.POMODORO] || 0,
                  [PomodoroTypeEnum.SHORT_BREAK]:
                    newConfig.timers?.[PomodoroTypeEnum.SHORT_BREAK] || 0,
                  [PomodoroTypeEnum.LONG_BREAK]: value,
                },
              });
            }}
          />
        </Box>
        <Box className="w-full flex gap-2 items-center mt-4">
          <TextField
            select
            label="Alarm sound"
            value={newConfig.alarmSound.value}
            onChange={(e) => {
              const selected = soundOptions.find(
                (opt) => opt.value === e.target.value
              );
              console.log(selected);
              console.log(e.target.value);
              if (!selected) return;
              setNewConfig({
                ...newConfig,
                alarmSound: {
                  label: selected.label,
                  value: selected.value,
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
                      const a = new Audio(
                        `${BUCKET_URL}/alarm/${option.value}.mp3`
                      );
                      a.play();

                      setAudio(a);
                      setCurrentSound(option.value);

                      a.addEventListener("ended", () => {
                        setCurrentSound(null);
                        setAudio(null);
                      });
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
            type="text"
            value={newConfig.longBreakInterval}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              const value = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);
              if (value < 1) {
                toast.error("Long break interval must be at least 1");
              }
              setNewConfig({
                ...newConfig,
                longBreakInterval: value,
              });
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowConfig(false);
            setNewConfig(configuration);
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigModal;
