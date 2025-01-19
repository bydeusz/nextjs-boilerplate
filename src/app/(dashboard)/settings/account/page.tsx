import { UpdatePassword } from "@/components/user/Update/UpdatePassword";
import { DeleteUser } from "@/components/user/Delete/DeleteUser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <UpdatePassword />
      <DeleteUser />
    </div>
  );
}
