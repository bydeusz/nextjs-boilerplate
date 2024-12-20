"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { InputField } from "@/components/inputs/InputField/Input";
import { TextArea } from "@/components/inputs/TextArea/TextArea";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export default function ContactForm() {
  const { data: session } = useSession();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const t = useTranslations("ContactForm");

  // Pre-fill name and email from session when available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/mailer/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      // Reset form and show success message
      setName(session?.user?.name || "");
      setEmail(session?.user?.email || "");
      setSubject("");
      setMessage("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
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
          disabled={!!session?.user?.name}
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
          disabled={!!session?.user?.email}
        />
        <InputField
          label={t("subject")}
          required={true}
          type="text"
          name="subject"
          id="subject"
          placeholder={t("subjectPlaceholder")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextArea
          label={t("message")}
          name="message"
          id="message"
          required={true}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          {t("submit")}
        </button>
      </form>
      {error && <Alert type="error" title="Error" description={t("error")} />}
      {success && (
        <Alert type="success" title="Success" description={t("success")} />
      )}
    </div>
  );
}
