import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "StoryMind AI - Smart Learning",
  description:
    "Transform your documents into engaging learning stories with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
