"use client";

import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const t = useTranslations("Buttons");

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center text-xs font-medium transition-all duration-200 text-gray-900 hover:bg-gray-100 hover:text-slate-700 rounded-md px-[10px] py-2">
      <ArrowRightStartOnRectangleIcon className="h-[20px] w-[20px] mr-2" />
      {t("logout")}
    </button>
  );
}
