import { redirect } from "next/navigation";
import { auth } from "@/config/auth";
import PasswordForm from "@/components/forms/Password/PasswordForm";

export default async function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  // Redirect to reset password page if no token
  if (!searchParams.token) {
    redirect("/reset-password");
  }

  return (
    <>
      <PasswordForm token={searchParams.token} />
    </>
  );
}
