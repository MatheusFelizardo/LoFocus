import { create } from "zustand";

export type ThemeState = {
  isConfigOpen: boolean;
  setIsConfigOpen: (isOpen: boolean) => void;
  currentBackground: string;
  setCurrentBackground: (background: string) => void;
  isVideoBackground: boolean;
  setIsVideoBackground: (isVideo: boolean) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isConfigOpen: false,
  setIsConfigOpen: (isOpen) => set({ isConfigOpen: isOpen }),
  currentBackground: "none",
  setCurrentBackground: (background) => {
    document.body.style.setProperty("--background", background);
    set({ currentBackground: background });
  },
  isVideoBackground: false,
  setIsVideoBackground: (isVideo) => set({ isVideoBackground: isVideo }),
}));
