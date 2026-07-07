import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Admin Dashboard - Portfolio",
  description: "Kelola data portfolio Anda secara real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${ibmPlexSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
