import { auth } from "@/lib/auth";
import LoginForm from "@/components/forms/LoginForm";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function LoginPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            create an account
          </Link>
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
