"use client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newLocale = event.target.value;

    // Set the cookie using Next.js API route
    await fetch("/api/language", {
      method: "POST",
      body: JSON.stringify({ locale: newLocale }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Refresh the page to apply the new locale
    router.refresh();
  };

  return (
    <div>
      <select
        id="language"
        name="language"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 hover:cursor-pointer"
        onChange={handleLanguageChange}
        value={locale}>
        <option value="nl">{t("dutch")}</option>
        <option value="en">{t("english")}</option>
      </select>
    </div>
  );
}
