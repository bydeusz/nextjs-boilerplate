"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export default function ResetPassword() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const t = useTranslations("ResetPassword");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">{t("resetTitle")}</h1>
        <p className="text-sm text-gray-500">{t("resetDescription")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label={t("email")}
          required={true}
          type="email"
          name="email"
          id="email"
          placeholder="john@doe.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex space-x-4 items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={
              !isLoading
                ? "flex items-center bg-primary text-white rounded-md hover:bg-secondary px-4 py-2 text-sm"
                : "flex items-center bg-gray-300 text-gray-600 rounded-md px-4 py-2 text-sm"
            }>
            {isLoading && <Loading className="size-4" />}
            {t("submit")}
          </button>
          <Link
            href="/login"
            className="text-sm text-primary hover:underline underline-offset-4">
            {t("login")}
          </Link>
        </div>
      </form>
      {error && <Alert type="error" title="Error" description={error} />}
      {success && (
        <Alert type="success" title="Success" description={t("success")} />
      )}
    </div>
  );
}
