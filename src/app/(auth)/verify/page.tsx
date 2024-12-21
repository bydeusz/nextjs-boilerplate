import { redirect } from "next/navigation";
import VerifyEmail from "@/components/forms/Verify/VerifyEmail";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  if (!searchParams.token) {
    redirect("/login");
  }

  return (
    <>
      <VerifyEmail token={searchParams.token} />
    </>
  );
}
