/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/Card";
import Admin from "@/components/modals/Admin/Admin";
import { DeleteUser } from "@/components/modals/Delete/Delete";
import { Badge } from "@/components/ui/Badge";

interface UserItemProps {
  user: any;
  currentUser: any;
}

export const TeammateCard = ({ user, currentUser }: UserItemProps) => {
  const t = useTranslations("Settings.team");

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center pt-6">
          <div className="flex space-x-4 items-center">
            <div className="overflow-hidden size-12 shrink-0 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xs border border-white ring-2 ring-gray-200">
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
              <div className="flex space-x-2 items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  {user.name}
                </h3>
                {user.isAdmin && <Badge variant="green">{t("admin")}</Badge>}
                {!user.emailVerified && (
                  <Badge variant="yellow">{t("pending")}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 font-normal">{user.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Admin
              user={user}
              disabled={
                !currentUser?.isAdmin ||
                currentUser?.id === user.id ||
                !user.emailVerified
              }
            />
            <DeleteUser
              user={user}
              disabled={!currentUser?.isAdmin || currentUser?.id === user.id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
