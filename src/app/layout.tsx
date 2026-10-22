import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Hattrick Dashboard - Akıllı Menajerlik & Otomatik Kadro",
  description:
    "Hattrick CHPP OAuth 1.0a entegrasyonu, otomatik kadro dizilimi, yapay zeka antrenman optimizasyonu ve maç kazanma oranları.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
