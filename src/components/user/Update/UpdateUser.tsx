"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import Image from "next/image";

export function UpdateUser() {
  const router = useRouter();
  const t = useTranslations("User.update");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "",
    avatar: "",
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
          avatar: data.user.avatar || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      }
    };

    getUser();
  }, []);

  console.log(formData);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or GIF file");
      return;
    }

    // Validate file size (100KB = 102400 bytes)
    if (file.size > 102400) {
      setError("File size must be less than 100KB");
      return;
    }

    // Validate image dimensions
    const img = document.createElement("img");
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width !== 80 || img.height !== 80) {
        setError("Image dimensions must be 80x80 pixels");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData((prev) => ({
            ...prev,
            avatar: base64String,
          }));
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Error handling avatar:", err);
        setError("Failed to handle avatar");
        setIsLoading(false);
      }
    };

    img.src = objectUrl;
  };

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-2">
      <h4>{t("title")}</h4>
      <form onSubmit={updateUser}>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20">
              {formData.avatar ? (
                <Image
                  src={formData.avatar}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">
                    {formData.fullname?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center">
                {isLoading ? <Loading className="h-4 w-4" /> : "Upload Avatar"}
              </label>
              <p className="text-xs text-gray-500">
                JPEG, PNG, GIF (80x80px, max 100KB)
              </p>
            </div>
          </div>

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
