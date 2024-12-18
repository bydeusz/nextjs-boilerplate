import LanguageSwitcher from "@/components/actions/LanguageSwitcher/LanguageSwitcher";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      <div className="hidden lg:flex lg:w-1/3 xl:w-1/2">
        <Image
          src="/img/mood-bg.jpg"
          alt="This is showing a mood background for the login screen"
          width={500}
          height={500}
          layout="responsive"
        />
      </div>
      <div className="relative flex w-full lg:w-2/3 xl:w-1/2 items-center bg-gray-100 justify-center p-4 md:p-0">
        <div className="lg:w-1/2 bg-white rounded-md p-8 shadow-2xl">
          {children}
        </div>
        <div className="absolute bottom-4 right-6">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
