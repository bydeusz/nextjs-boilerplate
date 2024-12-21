"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { PasswordInput } from "@/components/inputs/Password/Password";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

interface PasswordFormProps {
  token: string;
}

export default function PasswordForm({ token }: PasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("ResetPassword");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("errors.passwordLength"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      router.push("/login?reset=success");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">{t("resetTitle")}</h1>
        <p className="text-sm text-gray-500">{t("resetDescription")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label={t("newPassword")}
          required={true}
          name="password"
          id="password"
          placeholder={t("newPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label={t("confirmPassword")}
          required={true}
          name="confirmPassword"
          id="confirmPassword"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={
            !isLoading
              ? "flex items-center bg-primary text-white rounded-md hover:bg-secondary px-4 py-2 text-sm"
              : "flex items-center bg-gray-300 text-gray-600 rounded-md px-4 py-2 text-sm"
          }>
          {isLoading && <Loading className="size-4" />}
          {t("resetButton")}
        </button>
      </form>
      {error && <Alert type="error" title="Error" description={error} />}
    </div>
  );
}
