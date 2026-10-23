import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AstroVeda | Günlük Burç Yorumları (Astroloji.org, AskGanesha, GaneshaSpeaks & AstroSage)",
  description:
    "Astroloji.org, AskGanesha, GaneshaSpeaks ve AstroSage üzerinden Boğa, Yengeç, Aslan ve Başak burçları için günlük astroloji yorumları, şanslı sayılar ve renkler.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#060b14" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={poppins.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
