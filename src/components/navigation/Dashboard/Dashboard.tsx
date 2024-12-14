"use client";
import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import {
  Bars3Icon,
  XMarkIcon,
  Cog8ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  ArrowRightStartOnRectangleIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { Brand } from "@/components/lables/Brand/Brand";
import { NavLink } from "@/components/actions/NavLink/NavLink";
import { SearchInput } from "@/components/inputs/Search/Search";
import LanguageSwitcher from "@/components/actions/LanguageSwitcher/LanguageSwitcher";

interface DashboardProps {
  children: React.ReactNode;
  thumbnail?: React.ReactNode;
  lang: string;
  t: any;
}

export const Dashboard = ({ children, thumbnail, lang, t }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`p-4 fixed top-0 left-0 h-screen w-full md:w-64 border-r border-gray-200 md:flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:h-auto bg-white ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static z-50 md:z-auto`}>
        <button
          type="button"
          className="absolute top-4 right-4 p-2 text-gray-500 md:hidden hover:text-gray-900"
          onClick={toggleSidebar}>
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex justify-between mb-6">
          <Brand href={`/${lang}`} />
          {thumbnail}
        </div>

        <div className="mb-6">
          <SearchInput
            className="bg-gray-100 px-8 py-[9px] border border-gray-200 rounded-md text-xs text-gray-900 focus:border-gray-700"
            placeholder={t.navbar.search}
            name="search"
            id="search"
            disabled={true}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink href={`/${lang}`}>
            <HomeIcon className="h-[20px] w-[20px] mr-2" /> {t.navbar.dashboard}
          </NavLink>
          <NavLink href={`/${lang}/tools/neon-designer`}>
            <PaintBrushIcon className="h-[20px] w-[20px] mr-2" />{" "}
            {t.navbar.neonDesigner}
          </NavLink>
        </nav>
        <nav className="space-y-2 absolute bottom-0 left-0 w-full p-4 border-t">
          <LanguageSwitcher lang={lang} />
          <NavLink href={`/${lang}/settings`}>
            <Cog8ToothIcon className="h-[20px] w-[20px] mr-2" />
            {t.navbar.settings}
          </NavLink>
          <NavLink href={`/${lang}/support`}>
            <LifebuoyIcon className="h-[20px] w-[20px] mr-2" />{" "}
            {t.navbar.support}
          </NavLink>
          <SignOutButton>
            <button
              type="button"
              className="flex w-full items-center text-xs font-medium transition-all duration-200 text-gray-900 hover:bg-gray-100 hover:text-slate-700 rounded-md px-[10px] py-2">
              <ArrowRightStartOnRectangleIcon className="h-[20px] w-[20px] mr-2" />{" "}
              {t.navbar.signOut}
            </button>
          </SignOutButton>
        </nav>
      </div>

      <main className="flex flex-col flex-grow overflow-y-auto bg-slate-50">
        <button
          onClick={toggleSidebar}
          type="button"
          className="md:hidden absolute top-4 right-4">
          <Bars3Icon className="w-6 h-6 text-gray-900" />
        </button>
        <div>{children}</div>
      </main>
    </div>
  );
};
