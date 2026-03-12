import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linux & Android 퀴즈",
  description: "Linux Kernel & Android System 학습 퀴즈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
