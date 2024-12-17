"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const Tab = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-primary whitespace-nowrap ${isActive ? "text-primary border-primary" : ""}`}>
      {children}
    </Link>
  );
};
