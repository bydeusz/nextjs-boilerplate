"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import Link from "next/link";
import { Loading } from "@/components/lables/Loading/Loading";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("LoginForm");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "MissingCredentials":
        return t("errors.missingCredentials");
      case "UserNotFound":
        return t("errors.userNotFound");
      case "InvalidCredentials":
        return t("errors.invalidPassword");
      case "EmailNotVerified":
        return t("errors.emailNotVerified");
      default:
        return t("errors.default");
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.code) {
        setError(getErrorMessage(result.code));
        return;
      }

      if (result?.url) {
        router.push(result.url);
        router.refresh();
      }
    } catch (err) {
      setError(getErrorMessage("default"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("description")}</p>
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
        <PasswordInput
          name="password"
          id="password"
          label={t("password")}
          required={true}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex space-x-2 items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={
              !isLoading
                ? "flex items-center bg-primary text-white rounded-md hover:bg-secondary px-4 py-2 text-sm"
                : "flex items-center bg-gray-300 text-gray-600 rounded-md px-4 py-2 text-sm"
            }>
            {isLoading && <Loading className="size-4" />}
            {t("signIn")}
          </button>
          <Link
            href="/register"
            className="flex items-center bg-white text-primary font-medium hover:underline underline-offset-4 px-4 py-2 text-sm">
            {t("noAccount")}
          </Link>
        </div>
        <div>
          <Link
            href="/reset-password"
            className="text-sm text-gray-500 hover:underline underline-offset-4 hover:text-black">
            {t("forgotPassword")}
          </Link>
        </div>
      </form>
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
}
