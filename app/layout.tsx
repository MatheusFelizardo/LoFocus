import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoFocus — Pomodoro Timer with Lo-Fi Music",
  description:
    "Stay productive and relaxed with LoFocus — a minimal Pomodoro timer combined with Lo-Fi playlists.",

  keywords: [
    "Pomodoro timer",
    "LoFi music",
    "productivity app",
    "focus timer",
    "study timer",
    "work timer",
  ],

  openGraph: {
    title: "LoFocus — Pomodoro Timer with Lo-Fi Music",
    description:
      "Stay focused and boost your productivity with LoFocus, a Pomodoro timer integrated with relaxing Lo-Fi playlists.",
    url: "https://lofocus.app/",
    type: "website",
    images: "https://lofocus.app/og-image.png",
  },

  twitter: {
    card: "summary_large_image",
    title: "LoFocus — Pomodoro Timer with Lo-Fi Music",
    description:
      "Stay productive and relaxed with LoFocus — a minimal Pomodoro timer combined with Lo-Fi playlists.",
    images: "https://lofocus.app/og-image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

