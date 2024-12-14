"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { SelectInput } from "@/components/inputs/Select/Select";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";
import { userRoles } from "@/data/roles";

export function UpdateAvatar() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    initials: "",
    avatar: "",
  });

  const [avatar, setAvatar] = useState("");

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
    alert("Functionality not implemented yet");
  };

  return (
    <div className="p-6 border rounded-md bg-white space-y-4">
      <div className="flex justify-between">
        <h4>Profile picture</h4>
        <Button
          type="button"
          size="sm"
          onClick={handleEdit}
          className="text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black focus:ring-black rounded-md">
          {showForm ? "Cancel" : "Edit"}
        </Button>
      </div>
      {showForm ? (
        <>
          <form onSubmit={updateUser} className="space-y-4">
            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="file-upload" className="">
                      <span className="text-sm text-primary font-semibold underline underline-offset-4 cursor-pointer hover:no-underline">
                        Select a file
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="text-sm">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

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
              Upload
            </Button>
          </form>
          {error && <Alert title="Error" description={error} type="error" />}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
            <div>
              <p className="font-semibold text-sm">Avatar:</p>
              <p className="text-sm text-gray-500">
                Your avatar will be visible to your coworkers.
              </p>
            </div>
            <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-300">
              <svg
                className="h-full w-full text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
