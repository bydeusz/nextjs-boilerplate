"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Alert } from "@/components/messages/Alert/Alert";
import { Loading } from "@/components/lables/Loading/Loading";

interface AvatarInputProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File) => Promise<void>;
}

export function AvatarInput({
  currentAvatar,
  onAvatarChange,
}: AvatarInputProps) {
  const t = useTranslations("User.avatar");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatar || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File): boolean => {
    setError("");

    // Check file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      setError(t("errorFileSize"));
      return false;
    }

    // Check file type
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setError(t("errorFileType"));
      return false;
    }

    return true;
  };

  const validateDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        setError(t("errorLoading"));
        resolve(false);
      };
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) return;

    const validDimensions = await validateDimensions(file);
    if (!validDimensions) return;

    setIsLoading(true);
    try {
      await onAvatarChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err: unknown) {
      console.error("Error uploading avatar:", err);
      setError(t("errorUploading"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-8">
      <div className="relative size-32">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={t("avatarAlt")}
            width={128}
            height={128}
            className="rounded-lg object-cover size-32"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-400">{t("noAvatar")}</span>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <Loading className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-secondary disabled:bg-gray-300">
          {t("changeAvatar")}
        </button>
        <span className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileChange}
      />

      {error && <Alert type="error" title="Error" description={error} />}
    </div>
  );
}
