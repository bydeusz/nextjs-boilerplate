import { auth } from "@/lib/auth";
import RegisterForm from "@/components/forms/Register/RegisterForm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RegisterPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <div>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
