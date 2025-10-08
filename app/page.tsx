"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import TaskRegister from "./components/TaskRegister";
import { usePomodoroStore } from "./stores/usePomodoro";
import { useSessionStore } from "./stores/useSessionStore";
import ContinueLastSession from "./components/ContinueLastSession";
import Header from "./components/Header";
import BackdropLoading from "./components/BackdropLoading";
import { useThemeStore } from "./stores/useThemeStore";
import { themes } from "./components/Theme/ThemeLibrary";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { isLoading, loadProfile, configuration } = usePomodoroStore();
  const { updateTheme, themeConfig } = useThemeStore();
  const {
    loadSessions,
    isLoading: isLoadingSessions,
    history,
  } = useSessionStore();

  useEffect(() => {
    async function loadData() {
      await Promise.all([loadProfile(), loadSessions()]);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (configuration.selectedTheme) {
      updateTheme(configuration.selectedTheme);
    }
  }, [configuration.selectedTheme]);

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  if (status === "loading" || isLoading || isLoadingSessions || !themeConfig) {
    return <BackdropLoading />;
  }

  return (
    <>
      <div className="lofocus flex flex-col">
        <div className="sr-only">
          <h1>LoFocus — Pomodoro Timer with Lo-Fi Music</h1>
        </div>
        <Header middleContent={<TaskRegister />} />
        <main className="flex flex-col items-center justify-between px-4 py-2 relative flex-1">
          <Pomodoro />
          {history.length > 0 && <ContinueLastSession />}
        </main>
      </div>
    </>
  );
}
