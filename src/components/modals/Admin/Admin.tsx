import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/User";

import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

interface AdminProps {
  user: User;
}

export default function Admin({ user }: AdminProps) {
  const t = useTranslations("Modals.admin");
  const [inputValue, setInputValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const validateInput = () => {
      const fullName = `${user.name}`;
      setIsButtonDisabled(inputValue !== fullName);
    };
    validateInput();
  }, [inputValue, user.name]);

  const toggleAdmin = async (id: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update admin rights");
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update admin rights",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {user.isAdmin ? (
        <div className="space-y-4">
          <h2 className="text-base font-medium">{t("demote.title")}</h2>
          <p className="text-sm">{t("demote.desc")}</p>
          <InputField
            name="name"
            id="name"
            type="text"
            label={`${t("demote.label")} "${user.name}"`}
            placeholder={t("demote.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required={true}
          />

          {error && (
            <Alert type="error" title={t("error.title")} description={error} />
          )}

          <Button
            type="button"
            size="sm"
            className={`text-white border border-transparent rounded-md ${
              isButtonDisabled
                ? "bg-gray-500 hover:bg-gray-500 focus:ring-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            }`}
            disabled={isButtonDisabled}
            onClick={() => {
              if (user?.id) {
                toggleAdmin(user.id);
              } else {
                setError("User ID is undefined");
              }
            }}>
            {isLoading && <Loading className="h-4 w-4 mr-2" />}
            {t("demote.button")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-base font-medium">{t("promote.title")}</h2>
          <p className="text-sm">{t("promote.desc")}</p>
          <InputField
            name="name"
            id="name"
            type="text"
            label={`${t("promote.label")} "${user.name}"`}
            placeholder={t("promote.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required={true}
          />

          {error && (
            <Alert type="error" title={t("error.title")} description={error} />
          )}

          <Button
            type="button"
            size="sm"
            className={`text-white border border-transparent rounded-md ${
              isButtonDisabled
                ? "bg-gray-500 hover:bg-gray-500 focus:ring-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            }`}
            disabled={isButtonDisabled}
            onClick={() => {
              if (user?.id) {
                toggleAdmin(user.id);
              } else {
                setError("User ID is undefined");
              }
            }}>
            {isLoading && <Loading className="h-4 w-4 mr-2" />}
            {t("promote.button")}
          </Button>
        </div>
      )}
    </div>
  );
}
