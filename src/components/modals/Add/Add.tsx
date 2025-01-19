"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/hooks/useModal";

interface AddUserProps {
  isAdmin: boolean;
}

export const AddUser = ({ isAdmin }: AddUserProps) => {
  const t = useTranslations("Modals.add");
  const router = useRouter();
  const { openModal, ModalWrapper } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState({
    fullName: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputValue.email,
          name: inputValue.fullName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to invite user");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Button
        type="button"
        ariaLabel={t("button")}
        disabled={!isAdmin}
        className={`text-center text-xs border font-medium rounded-md ${
          !isAdmin
            ? "text-gray-500 bg-white border-gray-300 cursor-not-allowed"
            : "bg-white text-gray-500 border-gray-300 hover:bg-primary hover:border-primary hover:text-white"
        }`}
        onClick={openModal}>
        <PlusIcon className="size-4 mr-1" />
        {t("button")}
      </Button>

      <ModalWrapper>
        <div className="space-y-4">
          <h2 className="text-base font-medium">{t("title")}</h2>
          <p className="text-sm">{t("desc")}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label={t("fullName")}
              type="text"
              name="fullName"
              id="fullName"
              required={true}
              placeholder={t("fullNamePlaceholder")}
              value={inputValue.fullName}
              onChange={handleChange}
            />

            <InputField
              label={t("email")}
              type="email"
              name="email"
              id="email"
              required={true}
              placeholder={t("emailPlaceholder")}
              value={inputValue.email}
              onChange={handleChange}
            />

            {error && (
              <Alert
                type="error"
                title={t("error.title")}
                description={error}
              />
            )}
            <Button
              type="submit"
              size="sm"
              className={`text-white border border-transparent rounded-md ${
                isLoading
                  ? "bg-gray-500 hover:bg-gray-500 focus:ring-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary focus:ring-primary"
              }`}
              disabled={isLoading}>
              {isLoading && <Loading className="h-4 w-4 mr-2" />}
              {t("button")}
            </Button>
          </form>
        </div>
      </ModalWrapper>
    </>
  );
};
