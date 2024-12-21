"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import Link from "next/link";
import { Loading } from "@/components/lables/Loading/Loading";
import { useTranslations } from "next-intl";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const t = useTranslations("RegisterForm");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          label={t("name")}
          required={true}
          type="text"
          name="name"
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
            {t("signUp")}
          </button>
          <Link
            href="/login"
            className="font-medium text-sm text-primary hover:underline underline-offset-4">
            {t("alreadyHaveAccount")}
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
