'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from 'sonner';
import { SessionProvider } from "@/context/SessionProvider";
import Provider from "./provider";
import { Header } from "@/component";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>HealthCare Pro</title>
        <meta name="description" content="Professional healthcare platform" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <SessionProvider>
            <Header />
            {children}
            <Toaster richColors />
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}
