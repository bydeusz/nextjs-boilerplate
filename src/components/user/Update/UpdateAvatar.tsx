"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/messages/Alert/Alert";
import { AvatarInput } from "@/components/inputs/Avatar/AvatarInput";

export function UpdateAvatar() {
  const t = useTranslations("User.avatar");
  const [error, setError] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

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
        setCurrentAvatar(data.user.avatar || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      }
    };

    getUser();
  }, []);

  const handleAvatarChange = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update avatar");
      }

      const data = await response.json();
      setCurrentAvatar(data.avatar);
    } catch (err: unknown) {
      console.error("Error updating avatar:", err);
      throw err;
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-4">
      <h4>{t("title")}</h4>
      <AvatarInput
        currentAvatar={currentAvatar}
        onAvatarChange={handleAvatarChange}
      />
      {error && <Alert type="error" title="Error" description={error} />}
    </div>
  );
}
