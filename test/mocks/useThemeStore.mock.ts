import { vi } from "vitest";
import type { ThemeConfig } from "@/app/stores/useThemeStore";

export function createThemeStoreMock(overrides = {}) {
  return {
    isUpdatingTheme: false,
    setIsUpdatingTheme: vi.fn(),
    isConfigOpen: false,
    setIsConfigOpen: vi.fn(),
    currentTheme: "midnight",
    themeConfig: {
      background: "#000000",
      foreground: "#ffffff",
      textColor: "#ffffff",
      pomodoroPlayIcon: "#4caf50",
      pomodoroPauseIcon: "#ff9800",
      pomodoroStopIcon: "#f44336",
      playerBackground: "#1c1c1c",
      playerPlayIcon: "#4caf50",
      playerModsBgColor: "#333333",
      playerModsTextColor: "#ffffff",
      playerTextColor: "#ffffff",
      playerLineColor: "#4caf50",
      playerControlsColor: "#ffffff",
    } as ThemeConfig,
    contrastColor: "#ffffff",
    setThemeConfig: vi.fn(),
    isVideoBackground: false,
    setIsVideoBackground: vi.fn(),
    updateTheme: vi.fn(),
    ...overrides,
  };
}
