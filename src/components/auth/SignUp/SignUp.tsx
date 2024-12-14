"use client";
import { useState, FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Brand } from "@/components/lables/Brand/Brand";
import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import { Button } from "@/components/actions/Button/Button";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export function SignUp({ lang, t }: { lang: string; t: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/validate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailAddress }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data);
        return;
      }

      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError(err.message || err.errors[0].longMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // This function will handle the user submitting a code for verification
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setIsLoading(false);
        router.push(`/${lang}/onboarding`);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error:", JSON.stringify(err, null, 2));
      setError(err.errors[0].longMessage);
    }
  };

  return (
    <div className="space-y-6">
      {!verifying && (
        <>
          <div className="space-y-2">
            <Brand href="/" className="mb-6" />
            <h1 className="text-lg">{t.signUp.title}</h1>
            <p className="text-sm text-gray-500">{t.signUp.desc}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label={t.signUp.email}
              required={true}
              type="email"
              name="email"
              id="email"
              placeholder="john@doe.com"
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            <PasswordInput
              name="password"
              id="password"
              label={t.signUp.password}
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
                {t.signUp.submit}
              </Button>
              <Link
                href={`/${lang}/sign-in`}
                className="text-sm text-primary underline hover:text-secondary underline-offset-2">
                {t.signUp.signIn}
              </Link>
            </div>
          </form>
        </>
      )}

      {verifying && (
        <>
          <div className="space-y-2">
            <Brand href="/" className="mb-6" />
            <h1 className="text-lg">{t.signUp.verify}</h1>
            <p className="text-sm text-gray-500">{t.signUp.verifyDesc}</p>
          </div>
          <form onSubmit={handleVerify} className="space-y-4">
            <InputField
              label="Code"
              required={true}
              type="text"
              name="code"
              id="code"
              placeholder="enter code here"
              onChange={(e) => setCode(e.target.value)}
            />
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
              {t.signUp.completeSignUp}
            </Button>
          </form>
        </>
      )}

      {error && <Alert title="Error" description={error} type="error" />}
    </div>
  );
}
