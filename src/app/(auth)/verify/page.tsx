import type { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifyEmail from "@/components/forms/Verify/VerifyEmail";

export const metadata: Metadata = {
  title: "Verify your email - Next JS Dashboard Boilerplate by @bydeusz.com",
};

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
