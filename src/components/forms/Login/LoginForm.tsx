"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loading } from "@/components/lables/Loading/Loading";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("LoginForm");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (response?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          name="password"
          id="password"
          label={t("password")}
          required={true}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
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
            {t("signIn")}
          </button>
          <Link
            href="/register"
            className="font-medium text-sm text-primary hover:underline underline-offset-4">
            {t("noAccount")}
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
