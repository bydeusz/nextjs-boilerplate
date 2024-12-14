"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import { Alert } from "@/components/messages/Alert/Alert";
import { Brand } from "@/components/lables/Brand/Brand";

export const ResetPassword = ({ lang, t }: { lang: string; t: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    router.push(`/${lang}`);
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Brand href="/" className="mb-6" />
        <h1 className="text-lg">{t.resetPassword.title}</h1>
        <p className="text-sm text-gray-500">{t.resetPassword.desc}</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={!successfulCreation ? create : reset}>
        {!successfulCreation && (
          <>
            <InputField
              label={t.resetPassword.email}
              required={true}
              type="email"
              name="email"
              id="email"
              placeholder="john@doe.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex space-x-4 items-center">
              <Button type="submit" size="sm">
                {t.resetPassword.submit}
              </Button>
              <Link
                href={`/${lang}/sign-in"`}
                className="text-sm text-primary underline hover:text-secondary underline-offset-2">
                {t.resetPassword.signIn}
              </Link>
            </div>
            {error && <Alert type="error" title="Error" description={error} />}
          </>
        )}

        {successfulCreation && (
          <>
            <PasswordInput
              name="password"
              id="password"
              label={t.resetPassword.password}
              required={true}
              placeholder="Your new password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
              label={t.resetPassword.confirmPassword}
              required={true}
              type="text"
              name="password"
              id="password"
              placeholder="Enter the code here"
              onChange={(e) => setCode(e.target.value)}
            />

            <Button type="submit">{t.resetPassword.reset}</Button>
            {error && <Alert type="error" title="Error" description={error} />}
          </>
        )}

        {secondFactor && (
          <Alert
            type="info"
            title="2FA Authentication"
            description="2FA is required, but this UI does not handle that"
          />
        )}
      </form>
    </div>
  );
};
