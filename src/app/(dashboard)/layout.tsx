import { Dashboard } from "@/components/layout/Dashboard/Dashboard";
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
