"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import Image from "next/image";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function UpdateUser() {
  const router = useRouter();
  const t = useTranslations("User.update");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "",
    avatar: "",
  });

  const { error, success, NotificationComponent } = useNotification();

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
        error(t("errorTitle"), "Failed to load user data");
      }
    };

    getUser();
  }, [error, t]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      error(t("errorTitle"), "Please upload a JPEG, PNG, or GIF file");
      return;
    }

    // Validate file size (100KB = 102400 bytes)
    if (file.size > 102400) {
      error(t("errorTitle"), "File size must be less than 100KB");
      return;
    }

    // Validate image dimensions
    const img = document.createElement("img");
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width !== 80 || img.height !== 80) {
        error(t("errorTitle"), "Image dimensions must be 80x80 pixels");
        return;
      }

      try {
        setIsLoading(true);

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
        error(t("errorTitle"), "Failed to handle avatar");
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", formData.role);

      if (formData.avatar && formData.avatar.startsWith("data:image")) {
        // Convert base64 to blob
        const response = await fetch(formData.avatar);
        const blob = await response.blob();
        formDataToSend.append("avatar", blob, "avatar.png");
      }

      const response = await fetch("/api/user/update", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      success(t("successTitle"), t("successMessage"));
      router.refresh();
    } catch (err) {
      error(
        t("errorTitle"),
        err instanceof Error ? err.message : "Failed to update user",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
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
                  Upload Avatar
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

          <div className="mt-6">
            <Button variant="default" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4" />}
              {t("save")}
            </Button>
          </div>
        </form>
        <NotificationComponent />
      </CardContent>
    </Card>
  );
}
