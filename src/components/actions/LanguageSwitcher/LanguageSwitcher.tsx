"use client";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = async (event: any) => {
    const newLocale = event.target.value;

    // Get the current pathname without the existing locale
    const currentPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

    await fetch(`/api/set-locale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locale: newLocale }),
    });

    router.push(`/${newLocale}${currentPathname}`);
  };

  return (
    <div>
      <select
        id="language"
        name="language"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 hover:cursor-pointer"
        onChange={handleLanguageChange}
        value={lang}>
        <option value="nl">Nederlands</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
