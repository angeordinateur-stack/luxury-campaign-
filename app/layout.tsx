import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury AI Campaign Co-Creator",
  description: "Interactive luxury campaign co-creation with AI in real time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
