import { UpdatePassword } from "@/components/user/Update/UpdatePassword";

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <UpdatePassword />
    </div>
  );
}
