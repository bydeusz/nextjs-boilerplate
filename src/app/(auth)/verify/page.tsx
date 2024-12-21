import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import VerifyEmail from "@/components/forms/Verify/VerifyEmail";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const t = await getTranslations("Verify");

  if (!searchParams.token) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-gray-600">{t("verifying")}</p>
        </div>
        <VerifyEmail token={searchParams.token} />
      </div>
    </div>
  );
}
