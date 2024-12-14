"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { SelectInput } from "@/components/inputs/Select/Select";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import { userRoles } from "@/data/roles";

export function UpdateUser() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    role: "",
  });

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // Fetch user data
    const getUser = async () => {
      const response = await fetch("/api/user/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const res = await response.json();
        setUser(res.user);
      } else {
        console.error("Failed to fetch user data");
      }
    };

    getUser();
  }, [showForm]);

  const handleEdit = () => {
    setShowForm(!showForm);
  };

  const updateUser = async (event: any) => {
    event.preventDefault();
    const submitData = { firstname, lastname, role };
    setIsLoading(true);

    const response = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    if (response.status === 200) {
      setIsLoading(false);
      setShowForm(false);
    } else {
      const data = await response.json();
      setIsLoading(false);
      setError(data);
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-4">
      {showForm ? (
        <>
          <div className="flex justify-between">
            <h4>Personal details</h4>
            <Button
              type="button"
              size="sm"
              onClick={handleEdit}
              className="text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black focus:ring-black rounded-md">
              Cancel
            </Button>
          </div>
          <form onSubmit={updateUser} className="space-y-4">
            <InputField
              label="Firstname"
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter your firstname"
              initialValue={user.firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />

            <InputField
              label="Surname"
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter your surname"
              initialValue={user.lastname}
              onChange={(e) => setLastname(e.target.value)}
            />

            <SelectInput
              label="Role"
              name="role"
              id="role"
              onChange={(e) => setRole(e.target.value)}
              defaultValue={user.role}
              options={userRoles}
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
              Update
            </Button>
          </form>
          {error && <Alert title="Error" description={error} type="error" />}
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <h4>Personal details</h4>
            <Button
              type="button"
              size="sm"
              onClick={handleEdit}
              className="text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black focus:ring-black rounded-md">
              Edit
            </Button>
          </div>
          <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
            <div className="font-semibold">Firstname:</div>
            <div>{user.firstname}</div>
          </div>
          <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
            <div className="font-semibold">Lastname:</div>
            <div>{user.lastname}</div>
          </div>
          <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
            <div className="font-semibold">Role:</div>
            <div>{user.role}</div>
          </div>
        </>
      )}
    </div>
  );
}
