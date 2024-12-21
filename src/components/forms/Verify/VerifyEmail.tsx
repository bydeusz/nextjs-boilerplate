"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/actions/Button/Button";
import { Loading } from "@/components/lables/Loading/Loading";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

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
        <Loading className="size-8" />
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 p-8">
      <div className="flex justify-center items-center">
        {error ? (
          <XCircleIcon className="size-12 text-red-500" />
        ) : (
          <CheckCircleIcon className="size-12 text-green-500" />
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
        type="button"
        size="sm"
        onClick={() => router.push(`/login?verified=${!error}`)}>
        {t("backToLogin")}
      </Button>
    </div>
  );
}
