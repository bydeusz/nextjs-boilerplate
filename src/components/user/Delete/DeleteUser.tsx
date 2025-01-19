"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import { useModal } from "@/hooks/useModal";

export function DeleteUser() {
  const t = useTranslations("User.delete");
  const { data: session } = useSession();
  const { openModal, ModalWrapper } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const fullName = session?.user?.name || "";
    setIsButtonDisabled(newValue !== fullName);
  };

  const handleDelete = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out and redirect to login page
      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-4">
      <div className="space-y-2">
        <h4 className="text-base font-medium">{t("title")}</h4>
        <p className="text-sm text-gray-500">{t("description")}</p>
      </div>

      <Button
        type="button"
        size="sm"
        className="bg-red-500 hover:bg-red-600 text-white rounded-md"
        onClick={openModal}>
        {t("deleteButton")}
      </Button>

      <ModalWrapper>
        <div>
          <h2 className="text-lg font-medium">{t("modalTitle")}</h2>
          <p className="mt-2 text-sm text-gray-500">{t("modalDescription")}</p>

          <div className="mt-6 space-y-4">
            <InputField
              label={`${t("inputLabel")} "${session?.user?.name}"`}
              type="text"
              name="confirmName"
              id="confirmName"
              placeholder={t("inputPlaceholder")}
              value={inputValue}
              onChange={handleInputChange}
              required={true}
            />

            {error && (
              <Alert type="error" title={t("errorTitle")} description={error} />
            )}

            <div className="flex pt-4">
              <Button
                type="button"
                size="sm"
                className={`text-white rounded-md ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={isButtonDisabled || isLoading}
                onClick={handleDelete}>
                {isLoading && <Loading className="size-4 mr-2" />}
                {t("confirmButton")}
              </Button>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}
