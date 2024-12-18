import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export async function isLoggedIn(redirectTo: string = "/login") {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }
}
