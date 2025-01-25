"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

export default function RegisterConfirm({ email }: { email: string }) {
  const router = useRouter();
  const t = useTranslations("RegisterForm");

  return (
    <Card className="shadow-2xl">
      <CardContent>
        <div className="flex justify-center items-center">
          <ShieldCheck className="size-12 text-green-500" />
        </div>
        <h4 className="font-semibold text-green-500">{t("confirmTitle")}</h4>
        <p className="text-gray-600 text-sm">
          {t("confirmMessage", { email })}
        </p>
        <Button variant="default" onClick={() => router.push("/login")}>
          {t("backToLogin")}
        </Button>
      </CardContent>
    </Card>
  );
}
