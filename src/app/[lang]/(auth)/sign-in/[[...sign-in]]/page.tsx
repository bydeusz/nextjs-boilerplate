import { SignIn } from "@/components/auth/SignIn/SignIn";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");
  return <SignIn lang={lang} t={t} />;
}
