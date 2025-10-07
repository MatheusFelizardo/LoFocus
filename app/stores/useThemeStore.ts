import { create } from "zustand";
import { themes } from "../components/Theme/ThemeLibrary";

export type ThemeConfig = {
  background: string;
  foreground: string;
  textColor?: string;
  pomodoroPlayIcon?: string;
  pomodoroPauseIcon?: string;
  pomodoroStopIcon?: string;
  playerBackground?: string;
  playerPlayIcon?: string;
  playerModsBgColor?: string;
  playerModsTextColor?: string;
  playerTextColor?: string;
  playerLineColor?: string;
  playerControlsColor?: string;
};

export type ThemeState = {
  isConfigOpen: boolean;
  setIsConfigOpen: (isOpen: boolean) => void;
  currentTheme?: string;
  themeConfig: ThemeConfig | null;
  setThemeConfig: (background: ThemeConfig) => void;
  isVideoBackground: boolean;
  setIsVideoBackground: (isVideo: boolean) => void;
  contrastColor?: string;
  updateTheme: (themeMachineName: string) => void;
  isUpdatingTheme: boolean;
  setIsUpdatingTheme: (isUpdating: boolean) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isUpdatingTheme: false,
  setIsUpdatingTheme: (isUpdating) => set({ isUpdatingTheme: isUpdating }),
  isConfigOpen: false,
  setIsConfigOpen: (isOpen) => set({ isConfigOpen: isOpen }),
  currentTheme: "midnight",
  themeConfig: null,
  contrastColor: undefined,
  setThemeConfig: (themeConfig) => {
    const { currentTheme } = useThemeStore.getState();
    const root = document.documentElement;

    root.dataset.theme = currentTheme || "default";

    if (!root) return;

    if (themeConfig.background)
      root.style.setProperty("--background", themeConfig.background);
    if (themeConfig.foreground)
      root.style.setProperty("--foreground", themeConfig.foreground);
    if (themeConfig.textColor)
      root.style.setProperty("--text-color", themeConfig.textColor);
    if (themeConfig.playerBackground)
      root.style.setProperty(
        "--player-background",
        themeConfig.playerBackground
      );
    if (themeConfig.playerTextColor)
      root.style.setProperty(
        "--player-text-color",
        themeConfig.playerTextColor
      );
    if (themeConfig.playerLineColor)
      root.style.setProperty(
        "--player-line-color",
        themeConfig.playerLineColor
      );
    if (themeConfig.playerControlsColor)
      root.style.setProperty(
        "--player-controls-color",
        themeConfig.playerControlsColor
      );
    if (themeConfig.pomodoroPlayIcon)
      root.style.setProperty("--play-icon", themeConfig.pomodoroPlayIcon);
    if (themeConfig.pomodoroPauseIcon)
      root.style.setProperty("--pause-icon", themeConfig.pomodoroPauseIcon);
    if (themeConfig.pomodoroStopIcon)
      root.style.setProperty("--stop-icon", themeConfig.pomodoroStopIcon);
    if (themeConfig.playerModsBgColor)
      root.style.setProperty(
        "--player-mods-bg-color",
        themeConfig.playerModsBgColor
      );
    if (themeConfig.playerModsTextColor)
      root.style.setProperty(
        "--player-mods-text-color",
        themeConfig.playerModsTextColor
      );
    if (themeConfig.playerPlayIcon)
      root.style.setProperty("--player-play-icon", themeConfig.playerPlayIcon);

    set({ themeConfig });
  },
  isVideoBackground: false,
  setIsVideoBackground: (isVideo) => set({ isVideoBackground: isVideo }),
  updateTheme: (themeMachineName: string) => {
    console.log("Updating theme to:", themeMachineName);
    const { setThemeConfig } = useThemeStore.getState();
    const theme = themes.find((t) => t.machineName === themeMachineName);
    if (theme) {
      set({ currentTheme: themeMachineName });
      setThemeConfig(theme.themeConfig);
    }
  },
}));
