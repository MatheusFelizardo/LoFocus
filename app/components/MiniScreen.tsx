import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  IconButton,
  Slider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  PlayArrow,
  SkipNext,
  SkipPrevious,
  VolumeOff,
} from "@mui/icons-material";
import { Theme } from "./Theme/ThemeLibrary";

const MiniScreen = ({ theme }: { theme: Theme }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col justify-between transition-all duration-500">
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 w-full gap-0">
          <div>
            <Image
              src="/logo.svg"
              alt="LoFocus logo"
              width={150}
              height={50}
              className="w-[50px]"
              arial-label="LoFocus Logo"
            />
          </div>

          <Image
            src={session!.user!.image!}
            alt="User Avatar"
            width={16}
            height={16}
            className="rounded-full"
          />
        </header>

        <main className="flex flex-col items-center justify-between px-2 py-0 relative flex-1">
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Tabs
              value={0}
              textColor="inherit"
              variant="fullWidth"
              sx={{
                transform: "scale(0.5)",
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.themeConfig.foreground,
                },
                "& .MuiTab-root": {
                  color: theme.themeConfig.foreground,
                },
              }}
            >
              <Tab label="Pomodoro" component={"div"} />
              <Tab label="Short Break" component={"div"} />
              <Tab label="Long Break" component={"div"} />
            </Tabs>

            <div role="tabpanel">
              <Box className="relative" sx={{ p: 0 }}>
                <Typography
                  variant="h1"
                  sx={{ fontSize: "2rem", fontFamily: "monospace" }}
                  style={{ color: theme.themeConfig.textColor }}
                >
                  25:00
                </Typography>
              </Box>
            </div>

            <Box
              className="pointer-events-none"
              sx={{ display: "flex", justifyContent: "center", mt: 0 }}
            >
              <IconButton
                component={"div"}
                sx={{
                  color: theme.themeConfig.playerBackground,
                  "& svg": {
                    width: "20px",
                    height: "20px",
                  },
                }}
              >
                <PlayArrow />
              </IconButton>
            </Box>
          </Box>
        </main>
      </div>

      <div className="w-full">
        <div className="flex flex-col gap-1 w-full">
          <div
            className="p-1 rounded-t-lg"
            style={{ background: theme.themeConfig.playerBackground }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Box>
                  <IconButton
                    component={"div"}
                    className="p-2 rounded-full border"
                    style={{
                      color: theme.themeConfig.pomodoroPlayIcon,
                      borderColor: theme.themeConfig.pomodoroPlayIcon,
                    }}
                  >
                    <PlayArrow className="w-2 h-2" />
                  </IconButton>
                </Box>
                <div>
                  <div>
                    <h2
                      className="text-[6px] font-bold"
                      style={{ color: theme.themeConfig.playerTextColor }}
                    >
                      Fading Time
                    </h2>
                    <p
                      className="text-[4px] opacity-80"
                      style={{ color: theme.themeConfig.playerTextColor }}
                    >
                      Eugenio Mininni
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-1">
                <Typography
                  variant="body2"
                  sx={{ color: theme.themeConfig.playerTextColor }}
                  className="text-[6px]"
                >
                  Mood:
                </Typography>
                <Stack direction="row" spacing={0}>
                  <Button
                    component={"div"}
                    className="text-[2px] p-1 min-w-[10px] min-h-[10px] h-[10px]"
                    sx={{
                      bgcolor: theme.themeConfig.playerModsBgColor,
                      color: theme.themeConfig.playerModsTextColor,
                      border: "1px solid",
                      opacity: 1,
                      borderColor: theme.themeConfig.playerModsBgColor,
                    }}
                  >
                    Calm
                  </Button>
                  <Button
                    component={"div"}
                    className="text-[2px] p-1 min-w-[10px] min-h-[10px] h-[10px]"
                    sx={{
                      bgcolor: theme.themeConfig.playerModsBgColor,
                      color: theme.themeConfig.playerModsTextColor,
                      border: "none",
                      opacity: 0.3,
                      borderColor: theme.themeConfig.playerTextColor,
                    }}
                  >
                    Upbeat
                  </Button>
                </Stack>
              </div>
            </div>

            <div className="mt-0 text-sm relative">
              <Slider
                size="small"
                value={30}
                sx={{
                  color: theme.themeConfig.playerLineColor,
                  "& .MuiSlider-thumb": {
                    bgcolor: theme.themeConfig.playerLineColor,
                    width: 8,
                    height: 8,
                  },
                  "& .MuiSlider-track": {
                    bgcolor: theme.themeConfig.playerLineColor,
                  },
                }}
              />

              <Typography
                variant="caption"
                className="absolute left-0 -bottom-0 text-[6px]"
                style={{ color: theme.themeConfig.playerTextColor }}
              >
                00:30
              </Typography>

              <Typography
                variant="caption"
                className="absolute right-0 -bottom-0 text-[6px]"
                style={{ color: theme.themeConfig.playerTextColor }}
              >
                03:00
              </Typography>

              <div className="absolute right-0 -top-1 flex items-center gap-1">
                <div className="flex items-center gap-0">
                  <IconButton
                    component={"div"}
                    className="p-0 "
                    style={{ color: theme.themeConfig.playerControlsColor }}
                  >
                    <SkipPrevious className="w-2 h-2" />
                  </IconButton>

                  <IconButton
                    component={"div"}
                    className="p-1"
                    style={{ color: theme.themeConfig.playerControlsColor }}
                  >
                    <SkipNext className="w-2 h-2" />
                  </IconButton>
                </div>
                <div>
                  <IconButton
                    component={"div"}
                    className="p-1"
                    style={{ color: theme.themeConfig.playerControlsColor }}
                  >
                    <VolumeOff className="w-2 h-2" />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniScreen;
