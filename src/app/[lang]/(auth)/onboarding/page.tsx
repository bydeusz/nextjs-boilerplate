import { currentUser } from "@clerk/nextjs";
import { CreateUser } from "@/components/user/Create/Create";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Onboarding({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const user = await currentUser();
  const t = await getDictionary(lang as "en" | "nl");

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <CreateUser lang={lang} t={t} />
    </>
  );
}
