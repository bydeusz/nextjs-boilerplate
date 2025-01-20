"use client";
import { useState } from "react";
import { UserItem } from "@/components/team/UserItem/UserItem";
import { AddUser } from "@/components/modals/Add/Add";
import { SearchInput } from "@/components/inputs/Search/Search";
import { User } from "@/types/User";
import { useTranslations } from "next-intl";

interface TeamListProps {
  users: User[];
  currentUser: User | null;
}

export function TeamList({ users, currentUser }: TeamListProps) {
  const t = useTranslations("Navbar");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(searchLower) ||
      (user.email || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput
            name="search"
            id="search"
            placeholder={t("search")}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <AddUser isAdmin={currentUser?.isAdmin || false} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <UserItem key={user.id} user={user} currentUser={currentUser} />
        ))}
      </div>
    </>
  );
}
