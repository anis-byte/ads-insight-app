import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ads Insight App",
  description: "Upload ad CSVs and generate ready-to-send performance reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
