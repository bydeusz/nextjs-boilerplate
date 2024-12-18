import { auth } from "@/config/auth";
import LoginForm from "@/components/forms/Login/LoginForm";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <LoginForm />
    </>
  );
}
