"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import Image from "next/image";
import AccountMenu from "../components/Header";
import Playlist from "../components/Playlist/Playlist";
import BuyMeACoffee from "../components/BuyMeACoffee";
import TaskRegister from "../components/TaskRegister";
import { useSessionStore } from "../stores/useSessionStore";
import Link from "next/link";

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
    return (
      <main className=" flex items-center justify-center p-4">
        <Box className="absolute top-0 left-0 px-4 py-5">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LoFocus logo"
              width={150}
              height={50}
              className="w-[120px]"
              arial-label="LoFocus Logo"
            />
          </Link>
        </Box>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={true}
          onClick={() => {
            return false;
          }}
        >
          <CircularProgress size="30px" color="inherit" />
        </Backdrop>
      </main>
    );
  }

  return (
    <>
      <div className="lofocus flex flex-col">
        <div className="sr-only">
          <h1>LoFocus — Dashboard — Pomodoro Timer with Lo-Fi Music</h1>
        </div>
        <header className="flex items-center justify-between p-4 ">
          <div>
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="LoFocus logo"
                width={150}
                height={50}
                className="w-[120px]"
                arial-label="LoFocus Logo"
              />
            </Link>
          </div>
          <AccountMenu />
        </header>
        <main className="flex flex-col items-center justify-between px-4 py-2 relative flex-1"></main>
      </div>
    </>
  );
}

