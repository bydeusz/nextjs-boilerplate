import { isLoggedIn } from "@/utils/isLoggedIn";
import ContactForm from "@/components/forms/Contact/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  await isLoggedIn();

  return (
    <div className="p-4 md:p-12 space-y-6">
      <div className="flex pt-12 md:pt-0 md:justify-center md:items-center md:h-[calc(100vh-6rem)]">
        <div className="p-6 border rounded-md bg-white space-y-4 w-full md:w-1/2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
