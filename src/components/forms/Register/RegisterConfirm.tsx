"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/actions/Button/Button";

export default function RegisterConfirm({ email }: { email: string }) {
  const router = useRouter();
  const t = useTranslations("RegisterForm");

  return (
    <div className="text-center space-y-6 p-8">
      <div className="flex justify-center items-center">
        <CheckCircleIcon className="size-12 text-green-500" />
      </div>
      <h4 className="font-semibold text-green-500">{t("confirmTitle")}</h4>
      <p className="text-gray-600 text-sm">{t("confirmMessage", { email })}</p>
      <Button type="button" size="sm" onClick={() => router.push("/login")}>
        {t("backToLogin")}
      </Button>
    </div>
  );
}
