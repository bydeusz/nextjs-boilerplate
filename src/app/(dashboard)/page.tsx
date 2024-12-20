import { isLoggedIn } from "@/utils/isLoggedIn";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/headers/Header/Header";

export default async function Home() {
  await isLoggedIn();
  const t = await getTranslations("Dashboard");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header border={true} title={t("title")} />
    </div>
  );
}
