import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: "A minimalist one-page site with a playable space shooter demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
