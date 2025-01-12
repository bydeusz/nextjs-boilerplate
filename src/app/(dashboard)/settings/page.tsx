import { UpdateUser } from "@/components/user/Update/UpdateUser";

export default async function Page() {
  return (
    <div className="flex gap-8">
      <div className="w-3/4 space-y-4">
        <UpdateUser />
      </div>
    </div>
  );
}
