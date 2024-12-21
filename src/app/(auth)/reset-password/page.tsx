import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

import ResetPassword from "@/components/forms/Reset/ResetPassword";

export default async function ResetPasswordPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <ResetPassword />
    </>
  );
}
