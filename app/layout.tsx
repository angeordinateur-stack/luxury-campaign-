import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury AI Campaign Co-Creator",
  description: "Co-créez une campagne luxe avec l'IA en temps réel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
