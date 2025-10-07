"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSessionStore } from "../stores/useSessionStore";
import HistoryTable from "../components/HistoryTable";
import Header from "../components/Header";
import BackdropLoading from "../components/BackdropLoading";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const {
    loadSessions,
    isLoading: isLoadingSessions,
    history,
  } = useSessionStore();

  useEffect(() => {
    async function loadData() {
      await loadSessions();
    }

    loadData();
  }, []);

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  if (status === "loading" || isLoadingSessions) {
    return <BackdropLoading />;
  }

  return (
    <>
      <div className="lofocus flex flex-col">
        <div className="sr-only">
          <h1>LoFocus — Dashboard — Pomodoro Timer with Lo-Fi Music</h1>
        </div>
        <Header />
        <main className="flex flex-col items-center justify-between px-4 py-2 relative flex-1">
          <HistoryTable history={history} />
        </main>
      </div>
    </>
  );
}

