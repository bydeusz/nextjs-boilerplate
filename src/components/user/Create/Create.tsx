"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/inputs/InputField/Input";
import { Button } from "@/components/actions/Button/Button";
import { Brand } from "@/components/lables/Brand/Brand";
import { Alert } from "@/components/messages/Alert/Alert";
import { Loading } from "@/components/lables/Loading/Loading";
import { SelectInput } from "@/components/inputs/Select/Select";

import { userRoles } from "@/data/roles";
import { userOrganisation } from "@/data/organisation";

export function CreateUser({ lang, t }: { lang: string; t: any }) {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async (event: any) => {
    event.preventDefault();
    const submitData = { firstname, lastname, role, company };
    setIsLoading(true);

    const response = await fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    if (response.status === 200) {
      router.push(`/${lang}`);
    } else {
      const data = await response.json();
      setIsLoading(false);
      setError(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Brand href="/" className="mb-6" />
        <h1 className="text-lg">{t.onboarding.title}</h1>
        <p className="text-sm text-gray-500">{t.onboarding.desc}</p>
      </div>
      <form onSubmit={createUser} className="space-y-4">
        <InputField
          label={t.onboarding.firstname}
          required={true}
          type="text"
          name="firstname"
          id="firstname"
          placeholder="John"
          onChange={(e) => setFirstname(e.target.value)}
        />

        <InputField
          label={t.onboarding.surname}
          required={true}
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Doe"
          onChange={(e) => setLastname(e.target.value)}
        />

        <SelectInput
          label={t.onboarding.role}
          required={true}
          name="role"
          id="role"
          onChange={(e) => setRole(e.target.value)}
          defaultValue=" "
          options={userRoles}
        />

        <SelectInput
          label={t.onboarding.company}
          required={true}
          name="company"
          id="company"
          onChange={(e) => setCompany(e.target.value)}
          defaultValue=" "
          options={userOrganisation}
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
          {t.onboarding.submit}
        </Button>
      </form>
      {error && <Alert title="Error" description={error} type="error" />}
    </div>
  );
}
