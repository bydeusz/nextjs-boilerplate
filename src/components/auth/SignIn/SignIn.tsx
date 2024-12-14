"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Brand } from "@/components/lables/Brand/Brand";
import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import { Button } from "@/components/actions/Button/Button";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export function SignIn({ lang, t }: { lang: string; t: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  // Handle the submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status !== "complete") {
        console.log(JSON.stringify(completeSignIn, null, 2));
      }

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.push(`/${lang}`);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].longMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Brand href="/" className="mb-6" />
        <h1 className="text-lg">{t.signIn.title}</h1>
        <p className="text-sm text-gray-500">{t.signIn.desc}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label={t.signIn.email}
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
          label={t.signIn.password}
          required={true}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex space-x-4 items-center">
          <Button
            type="submit"
            size="sm"
            className={
              !isLoading
                ? "bg-primary text-white rounded-md hover:bg-secondary"
                : "bg-gray-300 text-gray-600 rounded-md"
            }
            disabled={isLoading}>
            {isLoading && <Loading className="h-4 w-4" />}
            {t.signIn.submit}
          </Button>
          <Link
            href={`/${lang}/reset-password`}
            className="text-sm text-primary underline hover:text-secondary underline-offset-2">
            {t.signIn.reset}
          </Link>
        </div>
      </form>
      {error && <Alert title="Error" description={error} type="error" />}
      <p className="text-xs">
        {t.signIn.noAccount}{" "}
        <Link
          href={`/${lang}/sign-up`}
          className="text-primary underline hover:text-secondary underline-offset-2">
          {t.signIn.signUp}
        </Link>
      </p>
    </div>
  );
}
