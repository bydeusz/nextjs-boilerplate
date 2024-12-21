"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loading } from "@/components/lables/Loading/Loading";

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
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2000);
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 text-primary hover:underline">
          {t("backToLogin")}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-green-500">{t("success")}</p>
      <p className="mt-2 text-gray-600">{t("redirecting")}</p>
    </div>
  );
}
