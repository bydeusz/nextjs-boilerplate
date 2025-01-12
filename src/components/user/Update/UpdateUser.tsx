"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export function UpdateUser() {
  const t = useTranslations("User.update");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/user/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData({
          fullname: data.user.fullname,
          email: data.user.email,
          role: data.user.role || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      }
    };

    getUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-2">
      <h4>{t("title")}</h4>
      <form onSubmit={updateUser}>
        <div className="space-y-4 mt-4">
          <InputField
            label={t("name")}
            type="text"
            name="fullname"
            id="fullname"
            placeholder={t("namePlaceholder")}
            value={formData.fullname}
            onChange={handleInputChange}
          />

          <InputField
            label={t("email")}
            type="email"
            name="email"
            id="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={handleInputChange}
          />

          <InputField
            label={t("role")}
            type="text"
            name="role"
            id="role"
            placeholder={t("rolePlaceholder")}
            value={formData.role}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-8">
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
            {t("save")}
          </Button>
        </div>
      </form>
      {error && <Alert title="Error" description={error} type="error" />}
    </div>
  );
}
