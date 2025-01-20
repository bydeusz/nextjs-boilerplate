import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterConfirm from "@/components/forms/Register/RegisterConfirm";

export const metadata: Metadata = {
  title: "Confirm your account - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function RegisterConfirmPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams.email) {
    redirect("/register");
  }

  return <RegisterConfirm email={searchParams.email as string} />;
}
