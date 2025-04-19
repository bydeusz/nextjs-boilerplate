import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { loadTranslations } from "@/utils/loadTranslations";

// List of supported locales
const locales = ["en", "nl"];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  // Try to get locale from cookie
  let locale = cookieStore.get("NEXT_LOCALE")?.value;

  // If no cookie, try to get from Accept-Language header
  if (!locale) {
    const acceptLanguage = headersList.get("accept-language");
    // Get the first supported locale from the Accept-Language header
    locale = acceptLanguage
      ?.split(",")
      ?.map((lang) => lang.split(";")[0].trim().substring(0, 2))
      ?.find((lang) => locales.includes(lang));
  }

  // Fall back to "en" if no supported locale is found
  if (!locale || !locales.includes(locale)) {
    locale = "en";
  }

  // Dynamically load all translation files
  const messages = await loadTranslations(locale);

  return {
    locale,
    messages,
  };
});