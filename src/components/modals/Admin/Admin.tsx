import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/User";

import { Button } from "@/components/ui/actions/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/messages/Dialog";
import { Settings } from "lucide-react";

interface AdminProps {
  user: User;
  disabled?: boolean;
}

export default function Admin({ user, disabled }: AdminProps) {
  const t = useTranslations("Modals.admin");
  const [inputValue, setInputValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const validateInput = () => {
      const fullName = `${user.name}`;
      setIsButtonDisabled(inputValue !== fullName);
    };
    validateInput();
  }, [inputValue, user.name]);

  const toggleAdmin = async (id: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update admin rights");
      }

      setOpen(false);
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update admin rights",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled}>
          <Settings className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user.isAdmin ? t("demote.title") : t("promote.title")}
          </DialogTitle>
          <DialogDescription>
            {user.isAdmin ? t("demote.desc") : t("promote.desc")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            name="name"
            id="name"
            type="text"
            label={`${user.isAdmin ? t("demote.label") : t("promote.label")} "${user.name}"`}
            placeholder={
              user.isAdmin ? t("demote.placeholder") : t("promote.placeholder")
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {error && (
            <Alert type="error" title={t("error.title")} description={error} />
          )}

          <Button
            type="button"
            variant="destructive"
            disabled={isButtonDisabled}
            onClick={() => {
              if (user?.id) {
                toggleAdmin(user.id);
              } else {
                setError("User ID is undefined");
              }
            }}>
            {isLoading && <Loading className="h-4 w-4 mr-2" />}
            {user.isAdmin ? t("demote.button") : t("promote.button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
