"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { InputField } from "@/components/inputs/InputField/Input";
import { Button } from "@/components/ui/actions/Button";
import { Loader2 } from "lucide-react";
import { Alert } from "@/components/messages/Alert/Alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/layout/Card";

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
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Button disabled={isLoading} variant="default">
              {isLoading && <Loader2 className="size-4" />}
              {t("submit")}
            </Button>
            <Link
              href="/login"
              className="text-sm text-primary hover:underline underline-offset-4">
              {t("login")}
            </Link>
          </div>
          {error && <Alert type="error" title="Error" description={error} />}
          {success && (
            <Alert type="success" title="Success" description={t("success")} />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
