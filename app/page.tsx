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
        <header className="flex items-center justify-between p-4 ">
          <div>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={50}
              className="w-[120px]"
            />
          </div>
          <AccountMenu />
        </header>
        <main className="flex flex-col items-center justify-between p-4 relative flex-1">
          <Pomodoro />
          <Playlist />
          <BuyMeACoffee />
        </main>
      </div>
    </>
  );
}

