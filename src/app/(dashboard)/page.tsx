import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/headers/Header/Header";

export default async function Home() {
  const session = await auth();
  const t = await getTranslations("Dashboard");

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t("title")} />
    </div>
  );
}
