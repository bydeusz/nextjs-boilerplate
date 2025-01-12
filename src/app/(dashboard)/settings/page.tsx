import { UpdateUser } from "@/components/user/Update/UpdateUser";
import { UpdatePassword } from "@/components/user/Update/UpdatePassword";

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <UpdateUser />
      <UpdatePassword />
    </div>
  );
}
