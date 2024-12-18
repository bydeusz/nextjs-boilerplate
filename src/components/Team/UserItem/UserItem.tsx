/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

import Modal from "@/components/messages/Modal/Modal";
import { Button } from "@/components/actions/Button/Button";
import { DeleteUser } from "@/components/user/Delete/Delete";
import Admin from "@/components/user/Admin/Admin";
import { Badge } from "@/components/lables/Badge/Badge";

interface UserItemProps {
  user: any;
  currentUser: any;
}

export const UserItem = ({ user, currentUser }: UserItemProps) => {
  const t = useTranslations("Settings.team");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);

  const handleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleAdminModal = () => {
    setOpenAdminModal(!openAdminModal);
  };

  return (
    <>
      <div
        className="flex justify-between items-center bg-white w-full p-4 rounded-lg border"
        key={user.id}>
        <div className="flex space-x-4 items-center">
          <div className="flex justify-center items-center bg-gray-100 h-12 w-12 rounded-full border font-semibold text-xs">
            {user.name?.charAt(0)}
          </div>
          <div className="text-sm">
            <div className="font-semibold flex space-x-2">
              <div>
                {user.name}{" "}
                {user.isAdmin && (
                  <Badge className="text-xs bg-blue-100 border border-blue-400 ml-[5px] px-2 py-[1px]">
                    {t("admin")}
                  </Badge>
                )}
              </div>
            </div>
            <div>{user.email}</div>
          </div>
        </div>
        <div className="space-x-4">
          {currentUser?.isAdmin && (
            <Button
              type="button"
              onClick={handleAdminModal}
              className="bg-white border rounded-md text-xs hover:bg-black hover:text-white hover:border-black">
              {t("settings")}
            </Button>
          )}

          {(currentUser?.isAdmin || currentUser?.id === user.id) && (
            <Button
              type="button"
              onClick={handleDeleteModal}
              className="bg-red-600 text-white border border-red-600 rounded-md text-xs hover:bg-transparent hover:text-red-600 hover:border-red-600">
              {t("delete")}
            </Button>
          )}
        </div>
      </div>
      <Modal isOpen={openDeleteModal} onClose={handleDeleteModal}>
        <DeleteUser user={user} />
      </Modal>
      <Modal isOpen={openAdminModal} onClose={handleAdminModal}>
        <Admin user={user} />
      </Modal>
    </>
  );
};
