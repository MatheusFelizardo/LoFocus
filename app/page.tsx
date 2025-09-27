"use client";

import { signOut, useSession } from "next-auth/react";
import { Button, Typography, Stack, Card, CardContent } from "@mui/material";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-dvh flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              Bem-vindo{session?.user?.name ? `, ${session.user.name}` : ""}!
            </Typography>

            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="User avatar"
                className="w-16 h-16 rounded-full shadow"
              />
            )}

            <Typography variant="body1">
              Você está logado com {session?.user?.email}
            </Typography>

            <Button
              variant="contained"
              color="error"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </main>
  );
}

