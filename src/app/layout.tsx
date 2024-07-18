"use client";

import "~/styles/globals.css";

import { SnackbarProvider as NotistackProvider } from "notistack";
import { Inter } from "next/font/google";

import Header from "~/components/header";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <NotistackProvider>
          {children}
        </NotistackProvider>
      </body>
    </html>
  );
}
