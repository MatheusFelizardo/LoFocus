"use client";

import { signOut, useSession } from "next-auth/react";
import { Button, Typography, Stack, Card, CardContent } from "@mui/material";
import { useEffect } from "react";
import Image from "next/image";
import AccountMenu from "./components/Header";
import Pomodoro from "./components/Pomodoro";
import Head from "next/head";
import Playlist from "./components/Playlist/Playlist";
import BuyMeACoffee from "./components/BuyMeACoffee";
import TaskRegister from "./components/TaskRegister";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-dvh flex items-center justify-center p-4">
        <Typography variant="h6" color="white">
          Loading...
        </Typography>
      </main>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  return (
    <>
      <div className="lofocus min-h-dvh flex flex-col">
        <div className="sr-only">
          <h1>LoFocus — Pomodoro Timer with Lo-Fi Music</h1>
        </div>
        <header className="flex items-center justify-between p-4 ">
          <div>
            <Image
              src="/logo.svg"
              alt="LoFocus logo"
              width={150}
              height={50}
              className="w-[120px]"
              arial-label="LoFocus Logo"
            />
          </div>
          <TaskRegister />
          <AccountMenu />
        </header>
        <main className="flex flex-col items-center justify-between px-4 py-2 relative flex-1">
          <Pomodoro />
          <div className="flex flex-col gap-1 w-full">
            <Playlist />
            <BuyMeACoffee />
          </div>
        </main>
      </div>
    </>
  );
}

