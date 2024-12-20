"use client";
import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  Cog8ToothIcon,
  HomeIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { Brand } from "@/components/lables/Brand/Brand";
import { NavLink } from "@/components/actions/NavLink/NavLink";
import { SearchInput } from "@/components/inputs/Search/Search";
import LanguageSwitcher from "@/components/actions/LanguageSwitcher/LanguageSwitcher";
import LogoutButton from "@/components/actions/Logout/LogoutButton";
import { useTranslations } from "next-intl";

interface DashboardProps {
  children: React.ReactNode;
  thumbnail?: React.ReactNode;
}

export const Dashboard = ({ children, thumbnail }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslations("Navbar");
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
          <Brand href="/" />
          <div className="hidden md:block">{thumbnail}</div>
        </div>

        <div className="mb-6">
          <SearchInput
            className="bg-gray-100 px-8 py-[9px] border border-gray-200 rounded-md text-xs text-gray-900 focus:border-gray-700"
            placeholder={t("search")}
            name="search"
            id="search"
            disabled={true}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink href="/">
            <HomeIcon className="h-[20px] w-[20px] mr-2" />{" "}
            {t("links.dashboard")}
          </NavLink>
        </nav>
        <nav className="space-y-2 absolute bottom-0 left-0 w-full p-4 border-t">
          <LanguageSwitcher />
          <NavLink href="/settings">
            <Cog8ToothIcon className="h-[20px] w-[20px] mr-2" />
            {t("links.settings")}
          </NavLink>
          <NavLink href="/support">
            <LifebuoyIcon className="h-[20px] w-[20px] mr-2" />
            {t("links.support")}
          </NavLink>
          <LogoutButton />
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
