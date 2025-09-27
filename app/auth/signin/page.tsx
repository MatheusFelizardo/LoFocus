"use client";

import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function SignInPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5" align="center" fontWeight={700}>
              Entrar
            </Typography>

            <Stack spacing={1.5}>
              <Button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                variant="contained"
                startIcon={<GoogleIcon />}
                fullWidth
                sx={{ py: 1.25 }}
              >
                Entrar com Google
              </Button>

              <Button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                variant="outlined"
                startIcon={<GitHubIcon />}
                fullWidth
                sx={{ py: 1.25 }}
              >
                Entrar com GitHub
              </Button>
            </Stack>

            <Divider />

            <Typography variant="body2" color="text.secondary" align="center">
              Ao continuar, você concorda com nossos Termos e Política de
              Privacidade.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </main>
  );
}
