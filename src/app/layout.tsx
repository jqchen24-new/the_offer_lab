import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "DS Interview Prep Tracker",
  description: "Track study sessions and daily prep for data science interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <PageContainer>{children}</PageContainer>
      </body>
    </html>
  );
}
