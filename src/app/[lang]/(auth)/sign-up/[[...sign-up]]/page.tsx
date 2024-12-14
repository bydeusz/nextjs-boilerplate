import { SignUp } from "@/components/auth/SignUp/SignUp";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");
  return <SignUp lang={lang} t={t} />;
}
