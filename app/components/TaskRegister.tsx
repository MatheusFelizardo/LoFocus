"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { PomodoroTypeEnum, usePomodoroStore } from "../stores/usePomodoro";
import { TagSelector } from "./TagSelector";
import { useSessionStore } from "../stores/useSessionStore";
import { Tag, useTagStore } from "../stores/useTagsStore";
import toast from "react-hot-toast";

const TaskRegister = () => {
  const { configuration } = usePomodoroStore();
  const { startSession, current } = useSessionStore();
  const { tags } = useTagStore();
  const [isRegistering, setIsRegistering] = useState(false);

  const [session, setSession] = useState({
    title: "",
    tags: [] as Tag[],
    focusDuration: configuration.timers?.[PomodoroTypeEnum.POMODORO],
    longBreakDuration: configuration.timers?.[PomodoroTypeEnum.LONG_BREAK],
    shortBreakDuration: configuration.timers?.[PomodoroTypeEnum.SHORT_BREAK],
    cycles: 0,
    expectedCycles: 4,
  });

  const handleSave = async () => {
    const isValid =
      session.title.trim().length > 0 &&
      session.focusDuration! > 0 &&
      session.shortBreakDuration! > 0 &&
      session.longBreakDuration! > 0 &&
      session.expectedCycles! > 0;

    if (!isValid) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    await startSession({
      title: session.title,
      focusDuration: session.focusDuration!,
      shortBreakDuration: session.shortBreakDuration!,
      longBreakDuration: session.longBreakDuration!,
      expectedCycles: session.expectedCycles!,
      tagIds: session.tags.map((t) => t.id!).filter(Boolean),
    });

    setIsRegistering(false);
  };

  useEffect(() => {
    console.log("Current session updated:", current);
  }, [current]);

  return (
    <>
      {current ? (
        <Box className="flex items-center gap-4">
          <Typography
            className="text-sm "
            style={{ color: "var(--text-color)" }}
          >
            {current.title}
          </Typography>
          <Box className="flex gap-1">
            {current?.tagIds?.length > 0 &&
              current.tagIds.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return (
                  <Chip
                    key={tag?.id}
                    size="small"
                    variant="outlined"
                    label={tag?.name}
                    className="text-xs "
                    style={{
                      color: "var(--text-color)",
                      borderColor: "var(--text-color)",
                    }}
                  />
                );
              })}
          </Box>
        </Box>
      ) : (
        <Button
          variant="outlined"
          onClick={() => setIsRegistering(true)}
          style={{
            color: "var(--player-line-color)",
            borderColor: "var(--player-line-color)",
          }}
        >
          New Session
        </Button>
      )}

      <Dialog
        open={isRegistering}
        onClose={() => setIsRegistering(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pomodoro Session</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            type="text"
            value={session.title}
            onChange={(e) =>
              setSession({
                ...session,
                title: e.target.value,
              })
            }
          />

          <TagSelector
            value={session.tags}
            onChange={(tags) => setSession({ ...session, tags })}
          />

          <Box className="mt-4">
            <Typography variant="body2" className="text-gray-500 mb-2">
              POMODORO
            </Typography>
            <Box className="flex gap-2">
              <TextField
                fullWidth
                margin="normal"
                label="Pomodoro"
                type="number"
                value={session.focusDuration}
                onChange={(e) =>
                  setSession({
                    ...session,
                    focusDuration: parseInt(e.target.value),
                  })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Short break"
                type="number"
                value={session.shortBreakDuration}
                onChange={(e) =>
                  setSession({
                    ...session,
                    shortBreakDuration: parseInt(e.target.value),
                  })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Long break"
                type="number"
                value={session.longBreakDuration}
                onChange={(e) =>
                  setSession({
                    ...session,
                    longBreakDuration: parseInt(e.target.value),
                  })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Cycles"
                type="number"
                value={session.expectedCycles}
                onChange={(e) =>
                  setSession({
                    ...session,
                    expectedCycles: parseInt(e.target.value),
                  })
                }
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsRegistering(false)}>Close</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskRegister;
