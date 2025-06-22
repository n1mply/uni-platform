import "./globals.css";
import type { Metadata } from "next";

export const titleMeta: Metadata = {
  title: "UniPlatform",
  description: "Цифровая SaaS-платформа для сайтов ВУЗов",
};

export const initialScaleMeta: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="">
      <body className="">
        {children}
      </body>
    </html>
  );
}