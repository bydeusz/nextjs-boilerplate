import { Dashboard } from "@/components/ui/Dashboard";
import { Thumbnail } from "@/components/user/Thumbnail/Thumbnail";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Dashboard thumbnail={<Thumbnail />}>{children}</Dashboard>
    </>
  );
}
