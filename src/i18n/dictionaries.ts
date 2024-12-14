import "server-only";

// Define the type for the locale keys
type Locale = "en" | "nl";

const dictionaries: Record<
  Locale,
  () => Promise<typeof import("../../public/dictionaries/en.json")>
> = {
  en: () =>
    import("../../public/dictionaries/en.json").then(
      (module) => module.default,
    ),
  nl: () =>
    import("../../public/dictionaries/nl.json").then(
      (module) => module.default,
    ),
};

// Ensure the locale parameter is of type Locale
export const getDictionary = async (locale: Locale) => dictionaries[locale]();
