import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import Playlist from "./components/Playlist/Playlist";
import BuyMeACoffee from "./components/BuyMeACoffee";

export const metadata: Metadata = {
  /* ... */
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <div
            className="min-h-dvh flex flex-col justify-between transition-all duration-500"
            style={{ background: "var(--background)" }}
          >
            <div className="flex-1">{children}</div>

            <div className="w-full bg-black">
              <div className="flex flex-col gap-1 w-full">
                <Playlist />
                <BuyMeACoffee />
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

