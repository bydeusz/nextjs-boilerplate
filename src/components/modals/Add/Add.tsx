"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/actions/Button/Button";
import Modal from "@/components/messages/Modal/Modal";
import { InputField } from "@/components/inputs/InputField/Input";
import { PasswordInput } from "@/components/inputs/Password/Password";
import { Loading } from "@/components/lables/Loading/Loading";
import { PlusIcon } from "@heroicons/react/20/solid";

interface AddUserProps {
  isAdmin: boolean;
}

export const AddUser = ({ isAdmin }: AddUserProps) => {
  const t = useTranslations("Modals.add");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState({
    fullName: "",
    email: "",
    password: "",
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
          password: inputValue.password,
          name: inputValue.fullName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      setIsOpen(false);
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
        className={`text-center text-xs border  font-medium rounded-md  ${
          !isAdmin
            ? "text-gray-500 bg-white border-gray-300 cursor-not-allowed"
            : "bg-white  text-gray-500 border-gray-300 hover:bg-primary hover:border-primary hover:text-white"
        }`}
        onClick={() => setIsOpen(true)}>
        <PlusIcon className="size-4 mr-1" />
        {t("button")}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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

            <PasswordInput
              label={t("password")}
              name="password"
              id="password"
              required={true}
              placeholder={t("passwordPlaceholder")}
              value={inputValue.password}
              onChange={handleChange}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </p>
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
      </Modal>
    </>
  );
};
