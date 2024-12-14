import "@/assets/style/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

interface LangParams {
  lang: string;
}
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "nl" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LangParams;
}>) {
  return (
    <ClerkProvider>
      <html lang={params.lang}>
        <body>
          {children}
          <div id="modal-root"></div>
        </body>
      </html>
    </ClerkProvider>
  );
}
