import { ResetPassword } from "@/components/auth/ResetPassword/ResetPassword";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");
  return <ResetPassword lang={lang} t={t} />;
}
