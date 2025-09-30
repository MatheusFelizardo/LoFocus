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
import Image from "next/image";

export default function SignInPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <Image
        src="/logo.png"
        alt="Logo"
        width={200}
        height={200}
        className="absolute top-4 left-4 w-40 h-auto object-contain"
      />
      <Card className="w-full max-w-sm shadow-md bg-black backdrop-blur-2xl bg-opacity-30 border border-gray-700">
        <CardContent>
          <Stack spacing={3}>
            <Typography
              variant="h5"
              align="center"
              fontWeight={700}
              className="text-white"
            >
              Sign In
            </Typography>

            <Stack spacing={1.5}>
              <Button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                variant="contained"
                startIcon={<GoogleIcon />}
                fullWidth
                sx={{ py: 1.25 }}
                className="bg-red-600 hover:bg-red-700"
              >
                Sign In with Google
              </Button>

              <Button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                variant="outlined"
                startIcon={<GitHubIcon />}
                fullWidth
                sx={{ py: 1.25 }}
                className="border-gray-600 text-white hover:bg-gray-200"
              >
                Sign in with GitHub
              </Button>
            </Stack>

            <Divider />

            {/* <Typography variant="body2" color="text.secondary" align="center">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </Typography> */}
          </Stack>
        </CardContent>
      </Card>
    </main>
  );
}
