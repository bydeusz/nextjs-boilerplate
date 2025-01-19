"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { InputField } from "@/components/inputs/InputField/Input";
import { TextArea } from "@/components/inputs/TextArea/TextArea";
import { Loading } from "@/components/lables/Loading/Loading";
import { useNotification } from "@/hooks/useNotification";

export default function ContactForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const t = useTranslations("ContactForm");
  const { error, success, NotificationComponent } = useNotification();

  // Pre-fill name and email from session when available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachment(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      error(t("errorTitle"), t("fileTypeError"));
      e.target.value = "";
      return;
    }

    // Validate file size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      error(t("errorTitle"), t("fileSizeError"));
      e.target.value = "";
      return;
    }

    setAttachment(file);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch("/api/mailer/contact", {
        method: "POST",
        body: formData,
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
      setAttachment(null);
      // Reset file input
      const fileInput = document.getElementById(
        "attachment",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      success(t("successTitle"), t("success"));
    } catch (err) {
      error(
        t("errorTitle"),
        err instanceof Error ? err.message : "Something went wrong",
      );
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
        <div className="space-y-2">
          <label
            htmlFor="attachment"
            className="block text-xs font-semibold text-gray-700">
            {t("attachment")}
          </label>
          <input
            type="file"
            id="attachment"
            name="attachment"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleFileChange}
            className="block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm
              file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-700
              file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs text-gray-500">{t("attachmentHelp")}</p>
        </div>
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
      <NotificationComponent />
    </div>
  );
}
