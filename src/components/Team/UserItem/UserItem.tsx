"use client";
import Modal from "@/components/messages/Modal/Modal";
import { Button } from "@/components/actions/Button/Button";
import { useState } from "react";
import { DeleteUser } from "@/components/user/Delete/Delete";
import Admin from "@/components/user/Admin/Admin";
import { Badge } from "@/components/lables/Badge/Badge";

interface UserItemProps {
  user: any;
  currentUser: any;
  t: any;
}

export const UserItem = ({ user, currentUser, t }: UserItemProps) => {
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
            {user.initials}
          </div>
          <div className="text-sm">
            <div className="font-semibold flex space-x-2">
              <div>
                {user.firstname} {user.lastname}{" "}
                {user.isAdmin && (
                  <Badge
                    size="sm"
                    className="font-semibold bg-pink-100 border border-pink-300 ml-[5px] text-[10px] px-2 py-[2px]">
                    Admin
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
              {t.pages.settings.team.settings}
            </Button>
          )}

          {(currentUser?.isAdmin || currentUser?.id === user.id) && (
            <Button
              type="button"
              onClick={handleDeleteModal}
              className="bg-red-600 text-white border border-red-600 rounded-md text-xs hover:bg-transparent hover:text-red-600 hover:border-red-600">
              {t.pages.settings.team.delete}
            </Button>
          )}
        </div>
      </div>
      <Modal isOpen={openDeleteModal} onClose={handleDeleteModal}>
        <DeleteUser t={t} user={user} />
      </Modal>
      <Modal isOpen={openAdminModal} onClose={handleAdminModal}>
        <Admin user={user} t={t} />
      </Modal>
    </>
  );
};
