import { isLoggedIn } from "@/utils/isLoggedIn";
import { auth } from "@/config/auth";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/config/prisma";

import { Header } from "@/components/headers/Header/Header";
import { Tabs } from "@/components/navigation/Tabs/Tabs";
import { Tab } from "@/components/actions/Tab/Tab";
import { UserItem } from "@/components/Team/UserItem/UserItem";

export default async function Page() {
  await isLoggedIn();
  const t = await getTranslations("Settings");

  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Fetch the current user from the database using their ID
  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  // Fetch all users from the database
  const users = await prisma.user.findMany();

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t("title")} />
      <Tabs>
        <Tab href={`/settings`}>{t("tabs.profile")}</Tab>
        <Tab href={`/settings/team`}>{t("tabs.team")}</Tab>
      </Tabs>
      <div className="space-y-2">
        {users.map((user) => (
          <UserItem key={user.id} user={user} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
