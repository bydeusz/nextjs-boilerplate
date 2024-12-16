import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/actions/LogoutButton";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {session.user.name || session.user.email}
            </h1>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
