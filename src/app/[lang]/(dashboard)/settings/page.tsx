import { Header } from "@/components/headers/Header/Header";
import { Tabs } from "@/components/navigation/Tabs/Tabs";
import { Tab } from "@/components/actions/Tab/Tab";
import { UpdateUser } from "@/components/user/Update/UpdateUser";
import { UpdateOrganisation } from "@/components/user/Update/UpdateOrganisation";
import { UpdateAvatar } from "@/components/user/Update/UpdateAvatar";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t.pages.settings.account.title} />
      <Tabs>
        <Tab href={`/${lang}/settings`}>{t.pages.settings.tabs.profile}</Tab>
        <Tab href={`/${lang}/settings/team`}>{t.pages.settings.tabs.team}</Tab>
      </Tabs>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          <UpdateUser />
          <UpdateAvatar />
        </div>
        <div>
          <UpdateOrganisation />
        </div>
      </div>
    </div>
  );
}
