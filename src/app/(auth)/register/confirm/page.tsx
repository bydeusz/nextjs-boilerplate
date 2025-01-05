import { redirect } from "next/navigation";
import RegisterConfirm from "@/components/forms/Register/RegisterConfirm";

export default function RegisterConfirmPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  if (!searchParams.email) {
    redirect("/register");
  }

  return <RegisterConfirm email={searchParams.email} />;
}
