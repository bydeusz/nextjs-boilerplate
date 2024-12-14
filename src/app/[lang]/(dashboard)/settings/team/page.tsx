import { Header } from "@/components/headers/Header/Header";
import { Tabs } from "@/components/navigation/Tabs/Tabs";
import { Tab } from "@/components/actions/Tab/Tab";
import { getDictionary } from "@/i18n/dictionaries";
import { prisma } from "@/utils/db";
import { auth } from "@clerk/nextjs";
import { UserItem } from "@/components/Team/UserItem/UserItem";

export default async function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");

  // Get the user ID from the session
  const { userId } = auth();
  const safeUserId = userId || undefined;

  // Fetch the current user from the database using their ID
  const currentUser = await prisma.user.findUnique({
    where: {
      clerkId: safeUserId,
    },
  });

  // Fetch all users from the database
  const users = await prisma.user.findMany();

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t.pages.settings.team.title} />
      <Tabs>
        <Tab href={`/${lang}/settings`}>{t.pages.settings.tabs.profile}</Tab>
        <Tab href={`/${lang}/settings/team`}>{t.pages.settings.tabs.team}</Tab>
      </Tabs>
      <div className="space-y-2">
        {users.map((user) => (
          <UserItem key={user.id} user={user} currentUser={currentUser} t={t} />
        ))}
      </div>
    </div>
  );
}
