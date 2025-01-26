import type { Metadata } from "next";

import { UpdateUser } from "@/components/user/Update/UpdateUser";
import { UpdatePassword } from "@/components/user/Update/UpdatePassword";
import { DeleteUser } from "@/components/user/Delete/DeleteUser";

export const metadata: Metadata = {
  title: "Settings - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <UpdateUser />
      <UpdatePassword />
      <DeleteUser />
    </div>
  );
}
