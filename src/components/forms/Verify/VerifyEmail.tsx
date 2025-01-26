"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/actions/Button";
import { Loader2 } from "lucide-react";
import { ShieldCheck, ShieldX } from "lucide-react";

export default function VerifyEmail({ token }: { token: string }) {
  const router = useRouter();
  const t = useTranslations("Verify");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="size-8" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center items-center">
          {error ? (
            <ShieldX className="size-12 text-red-500" />
          ) : (
            <ShieldCheck className="size-12 text-green-500" />
          )}
        </div>
        <h4
          className={`font-semibold ${error ? "text-red-500" : "text-green-500"}`}>
          {error || t("success")}
        </h4>
        <p className="text-gray-600 text-sm">
          {error ? t("error") : t("redirecting")}
        </p>
        <Button
          variant="default"
          onClick={() => router.push(`/login?verified=${!error}`)}>
          {t("backToLogin")}
        </Button>
      </CardContent>
    </Card>
  );
}
