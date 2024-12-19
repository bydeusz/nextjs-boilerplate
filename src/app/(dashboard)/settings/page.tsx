import { isLoggedIn } from "@/utils/isLoggedIn";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/headers/Header/Header";
import { Tabs } from "@/components/navigation/Tabs/Tabs";
import { Tab } from "@/components/actions/Tab/Tab";
import { UpdateUser } from "@/components/user/Update/UpdateUser";
import { UpdatePassword } from "@/components/user/Update/UpdatePassword";

export default async function Page() {
  await isLoggedIn();
  const t = await getTranslations("Settings");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t("title")} />
      <Tabs>
        <Tab href={`/settings`}>{t("tabs.profile")}</Tab>
        <Tab href={`/settings/team`}>{t("tabs.team")}</Tab>
      </Tabs>
      <div className="space-y-4">
        <UpdateUser />
        <UpdatePassword />
      </div>
    </div>
  );
}
