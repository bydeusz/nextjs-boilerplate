import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import TranslationTest from "@/components/test/TranslationTest";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold">
        Welcome, {session.user.name || session.user.email}
      </h1>
      <p className="text-gray-600">{session.user.email}</p>
      <div>
        <TranslationTest />
      </div>
    </div>
  );
}
