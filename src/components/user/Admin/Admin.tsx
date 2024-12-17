import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import React, { useState, useEffect } from "react";
import { Loading } from "@/components/lables/Loading/Loading";

interface AdminProps {
  user: any;
  t: any;
}

export default function Admin({ user, t }: AdminProps) {
  const [inputValue, setInputValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateInput = () => {
      const fullName = `${user.firstname} ${user.lastname}`;
      setIsButtonDisabled(inputValue !== fullName);
    };
    validateInput();
  }, [inputValue, user.firstname, user.lastname]);

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    const response = await fetch("/api/user/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id }),
    });

    if (response.status === 200) {
      setIsLoading(false);
      window.location.reload();
    } else {
      const data = await response.json();
      setIsLoading(false);
      console.error(data);
    }
  };

  return (
    <div>
      {user.isAdmin ? (
        <div className="space-y-4">
          <h2 className="text-base font-medium">
            {t.modals.admin.demote.title}
          </h2>
          <p className="text-sm">{t.modals.admin.demote.desc}</p>
          <InputField
            name="name"
            id="name"
            type="text"
            label={`${t.modals.admin.demote.label} "${user.firstname} ${user.lastname}"`}
            placeholder={t.modals.admin.demote.placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            required={true}
          />
          <Button
            type="button"
            size="sm"
            className={`text-white border border-transparent rounded-md ${
              isButtonDisabled
                ? "bg-gray-500 hover:bg-gray-500 focus:ring-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            }`}
            disabled={isButtonDisabled}
            onClick={() => {
              if (user?.id) {
                deleteUser(user.clerkId);
              } else {
                console.error("User or user ID is undefined");
              }
            }}>
            {isLoading && <Loading className="h-4 w-4" />}
            {t.modals.admin.demote.button}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-base font-medium">
            {t.modals.admin.promote.title}
          </h2>
          <p className="text-sm">{t.modals.admin.promote.desc}</p>
          <InputField
            name="name"
            id="name"
            type="text"
            label={`${t.modals.admin.promote.label} "${user.firstname} ${user.lastname}"`}
            placeholder={t.modals.admin.promote.placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            required={true}
          />
          <Button
            type="button"
            size="sm"
            className={`text-white border border-transparent rounded-md ${
              isButtonDisabled
                ? "bg-gray-500 hover:bg-gray-500 focus:ring-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            }`}
            disabled={isButtonDisabled}
            onClick={() => {
              if (user?.id) {
                deleteUser(user.clerkId);
              } else {
                console.error("User or user ID is undefined");
              }
            }}>
            {isLoading && <Loading className="h-4 w-4" />}
            {t.modals.admin.promote.button}
          </Button>
        </div>
      )}
    </div>
  );
}
