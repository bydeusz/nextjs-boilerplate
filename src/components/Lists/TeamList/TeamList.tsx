"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/User";

import { AddUser } from "@/components/modals/Add/Add";
import { SearchInput } from "@/components/inputs/Search/Search";
import { TeammateCard } from "@/components/cards/TeammateCard";
import { Skeleton } from "@/components/ui/layout/Skeleton";

interface TeamListProps {
  currentUser: string;
}

export function TeamList({ currentUser }: TeamListProps) {
  const t = useTranslations("Navbar");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/get");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        const foundUser = data.find((user: User) => user.id === currentUser);
        setCurrentUserData(foundUser || null);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

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
        <AddUser isAdmin={currentUserData?.isAdmin || false} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[...Array(9)].map((_, index) => (
              <div key={index} className="p-6 rounded-lg border bg-card">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          filteredUsers.map((user) => (
            <TeammateCard
              key={user.id}
              user={user}
              currentUser={currentUserData || user}
            />
          ))
        )}
      </div>
    </>
  );
}
