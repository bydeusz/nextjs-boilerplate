import NeonDesigner from "@/components/cards/Tools/NeonDesigner/NeonDesigner";
import { Header } from "@/components/headers/Header/Header";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Dashboard({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = await getDictionary(lang as "en" | "nl");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t.pages.dashboard.title} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <NeonDesigner lang={lang} t={t} />
      </div>
    </div>
  );
}
