import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UniPlatform",
  description: "Цифровая SaaS-платформа для сайтов ВУЗов",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="pt-20">
        {children}
      </body>
    </html>
  );
}
