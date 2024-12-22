import { UpdateUser } from "@/components/user/Update/UpdateUser";
import { UpdatePassword } from "@/components/user/Update/UpdatePassword";

export default async function Page() {
  return (
    <>
      <UpdateUser />
      <UpdatePassword />
    </>
  );
}
