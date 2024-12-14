import { Dashboard } from "@/components/navigation/Dashboard/Dashboard";
import { Thumbnail } from "@/components/user/Thumbnail/Thumbnail";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Layout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const t = await getDictionary(lang as "en" | "nl");

  return (
    <>
      <Dashboard lang={lang} t={t} thumbnail={<Thumbnail />}>
        {children}
      </Dashboard>
    </>
  );
}
