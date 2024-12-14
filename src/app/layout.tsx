import type { Metadata } from "next";
import '@/assets/styles/globals.css'

export const metadata: Metadata = {
  title: "Next.js Boilerplate - by Tadeusz de Ruijter",
  description: "A modern Next.js boilerplate with TypeScript, Prisma, TailwindCSS, and ESLint - ready for full-stack development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
