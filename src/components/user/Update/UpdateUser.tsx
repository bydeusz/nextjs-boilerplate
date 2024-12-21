"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { SelectInput } from "@/components/inputs/Select/Select";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import { useRoles } from "@/hooks/useRoles";

export function UpdateUser() {
  const t = useTranslations("User.update");
  const roles = useRoles();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    role: "",
  });

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/user/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);
        // Initialize form fields with current user data
        setFullname(data.user.fullname);
        setEmail(data.user.email);
        setRole(data.user.role);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      }
    };

    getUser();
  }, [showForm]);

  const handleEdit = () => {
    setShowForm(!showForm);
    setError("");
  };

  const updateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setUser(data.user);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-4">
      {showForm ? (
        <>
          <div className="flex justify-between">
            <h4>{t("title")}</h4>
            <Button
              type="button"
              size="sm"
              onClick={handleEdit}
              className="text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black focus:ring-black rounded-md">
              {t("cancel")}
            </Button>
          </div>
          <form onSubmit={updateUser} className="space-y-4">
            <InputField
              label={t("name")}
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />

            <InputField
              label={t("email")}
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <SelectInput
              label={t("role")}
              name="role"
              id="role"
              onChange={(e) => setRole(e.target.value)}
              defaultValue={user.role}
              options={roles}
            />

            <Button
              type="submit"
              size="sm"
              className={
                !isLoading
                  ? "bg-primary text-white rounded-md hover:bg-secondary"
                  : "bg-gray-300 text-gray-600 rounded-md"
              }
              disabled={isLoading}>
              {isLoading && <Loading className="h-4 w-4" />}
              {t("save")}
            </Button>
          </form>
          {error && <Alert title="Error" description={error} type="error" />}
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <h4>{t("title")}</h4>
            <Button
              type="button"
              size="sm"
              onClick={handleEdit}
              className="text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black focus:ring-black rounded-md">
              {t("edit")}
            </Button>
          </div>
          <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
            <div className="font-semibold">{t("name")}:</div>
            <div>{user.fullname}</div>
          </div>
          <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
            <div className="font-semibold">{t("email")}:</div>
            <div>{user.email}</div>
          </div>
          <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
            <div className="font-semibold">{t("role")}:</div>
            <div>{user.role}</div>
          </div>
        </>
      )}
    </div>
  );
}
