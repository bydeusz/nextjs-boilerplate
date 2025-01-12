"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PasswordInput } from "@/components/inputs/Password/Password";
import { Button } from "@/components/actions/Button/Button";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export function UpdatePassword() {
  const t = useTranslations("User.password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update password");
      }

      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to update password",
      );
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-4">
      <h4>{t("title")}</h4>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <PasswordInput
            label={t("currentPassword")}
            required={true}
            name="currentPassword"
            id="currentPassword"
            placeholder={t("currentPasswordPlaceholder")}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
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
          {error && <Alert type="error" title="Error" description={error} />}
        </div>
        <div className="mt-8">
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className={
              !isLoading
                ? "flex items-center bg-primary text-white rounded-md hover:bg-secondary"
                : "flex items-center bg-gray-300 text-gray-600 rounded-md"
            }>
            {isLoading && <Loading className="size-4 mr-2" />}
            {t("update")}
          </Button>
        </div>
      </form>
    </div>
  );
}
