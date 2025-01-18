/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  TrashIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import { DeleteUser } from "@/components/modals/Delete/Delete";
import Admin from "@/components/modals/Admin/Admin";
import { Badge } from "@/components/lables/Badge/Badge";
import { useModal } from "@/hooks/useModal";

interface UserItemProps {
  user: any;
  currentUser: any;
}

export const UserItem = ({ user, currentUser }: UserItemProps) => {
  const t = useTranslations("Settings.team");
  const deleteModal = useModal();
  const adminModal = useModal();

  return (
    <>
      <div className="rounded-lg border bg-white relative">
        <div className="flex w-full items-center justify-between space-x-6 p-6">
          <div className="flex space-x-4">
            <div className="overflow-hidden size-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xs border border-white ring-2 ring-gray-200">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={`avatar picture of ${user.name}`}
                  width={50}
                  height={50}
                />
              ) : (
                user.name?.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="-mt-px flex divide-x divide-gray-200 border-t border-gray-200">
            <div className="flex w-0 flex-1">
              <button
                onClick={adminModal.openModal}
                disabled={!currentUser?.isAdmin || currentUser?.id === user.id}
                className={`relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold ${
                  currentUser?.isAdmin && currentUser?.id !== user.id
                    ? "text-gray-900 hover:bg-gray-50"
                    : "text-gray-400 cursor-not-allowed"
                }`}>
                <AdjustmentsHorizontalIcon className="size-5 text-gray-400" />
                {t("settings")}
              </button>
            </div>
            <div className="-ml-px flex w-0 flex-1">
              <button
                onClick={deleteModal.openModal}
                disabled={!currentUser?.isAdmin || currentUser?.id === user.id}
                className={`relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold ${
                  currentUser?.isAdmin && currentUser?.id !== user.id
                    ? "text-red-600 hover:bg-red-50"
                    : "text-red-300 cursor-not-allowed"
                }`}>
                <TrashIcon
                  className={`size-5 ${currentUser?.isAdmin && currentUser?.id !== user.id ? "text-red-400" : "text-red-300"}`}
                />
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
        {user.isAdmin && (
          <Badge className="absolute top-3 right-3 rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 border border-green-600/20">
            {t("admin")}
          </Badge>
        )}
      </div>

      <deleteModal.ModalWrapper>
        <DeleteUser user={user} />
      </deleteModal.ModalWrapper>

      <adminModal.ModalWrapper>
        <Admin user={user} />
      </adminModal.ModalWrapper>
    </>
  );
};
