import { auth } from "@/config/auth";
import RegisterForm from "@/components/forms/Register/RegisterForm";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <RegisterForm />
    </>
  );
}
