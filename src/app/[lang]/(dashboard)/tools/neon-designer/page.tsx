import Container from "@/components/Tools/NeonDesigner/Container/Container";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");

  return (
    <>
      <Container lang={lang} t={t} />
    </>
  );
}
