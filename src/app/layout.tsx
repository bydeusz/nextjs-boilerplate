import { AuthProviders } from "@/providers/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { initializeBucket } from "@/config/minio";

import "@/assets/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  await initializeBucket();

  return (
    <html lang={locale}>
      <body>
        <AuthProviders>
          <NextIntlClientProvider messages={messages}>
            {children}
            <div id="toaster-root"></div>
          </NextIntlClientProvider>
        </AuthProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
