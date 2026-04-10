import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roleta Interativa",
  description: "Crie roletas personalizadas, compartilhe por link e gire online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
