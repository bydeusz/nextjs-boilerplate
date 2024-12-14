"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/actions/Button/Button";
import { InputField } from "@/components/inputs/InputField/Input";
import { Loading } from "@/components/lables/Loading/Loading";
import { Alert } from "@/components/messages/Alert/Alert";

export function UpdateOrganisation() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    isAdmin: "",
  });

  const [organisation, setOrganisation] = useState({
    name: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    btw: "",
  });

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setaddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [btw, setBtw] = useState("");

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
        setOrganisation(res.organisation);
      } else {
        console.error("Failed to fetch user data");
      }
    };

    getUser();
  }, [showForm]);

  const handleEdit = () => {
    setShowForm(!showForm);
  };

  const submitHandler = async (event: any) => {
    event.preventDefault();
    const submitData = {
      name,
      website,
      phone,
      email,
      address,
      city,
      country,
      zip,
      btw,
    };
    setIsLoading(true);

    const response = await fetch("/api/organisation/update", {
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
    <div className="p-6 border rounded-md bg-white">
      <div className="flex justify-between">
        <h4>Organisation</h4>
        <Button
          type="button"
          size="sm"
          onClick={handleEdit}
          disabled={!user.isAdmin}
          className="text-black bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black focus:ring-black rounded-md">
          {showForm ? "Cancel" : "Edit"}
        </Button>
      </div>
      {showForm ? (
        <>
          <form onSubmit={submitHandler}>
            <div className="space-y-2 mt-2">
              <InputField
                label="Name"
                type="text"
                name="name"
                id="name"
                placeholder="Company name"
                initialValue={organisation.name}
                onChange={(e) => setName(e.target.value)}
              />

              <InputField
                label="Phone"
                type="text"
                name="phone"
                id="phone"
                placeholder="+31 10 12345678"
                initialValue={organisation.phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <InputField
                label="Email"
                type="email"
                name="email"
                id="email"
                placeholder="info@company.com"
                initialValue={organisation.email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Website"
                type="text"
                name="website"
                id="website"
                placeholder="www.company.com"
                initialValue={organisation.website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="mt-8 mb-4 space-y-2">
              <div className="border-b pb-4">
                <h5 className="text-sm font-semibold">
                  Additional information
                </h5>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Address"
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Street 123"
                  initialValue={organisation.address}
                  onChange={(e) => setaddress(e.target.value)}
                />
                <InputField
                  label="Postal code"
                  type="text"
                  name="zip"
                  id="zip"
                  placeholder="1234 AB"
                  initialValue={organisation.zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>

              <InputField
                label="City"
                type="text"
                name="city"
                id="city"
                placeholder="Rotterdam"
                initialValue={organisation.city}
                onChange={(e) => setCity(e.target.value)}
              />

              <InputField
                label="Country"
                type="text"
                name="country"
                id="country"
                placeholder="Nederland"
                initialValue={organisation.country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <InputField
                label="BTW"
                type="text"
                name="btw"
                id="btw"
                placeholder="NL123456789B01"
                initialValue={organisation.btw}
                onChange={(e) => setBtw(e.target.value)}
              />
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
              Update
            </Button>
          </form>
          {error && <Alert title="Error" description={error} type="error" />}
        </>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Name:</div>
              <div>{organisation.name}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Website:</div>
              <div>{organisation.website}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Phone:</div>
              <div>{organisation.phone}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Email:</div>
              <div>{organisation.email}</div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="border-b pb-4">
              <h5 className="text-sm font-semibold">Additional information</h5>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Address:</div>
              <div>{organisation.address}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">City:</div>
              <div>{organisation.city}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Country:</div>
              <div>{organisation.country}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">Postal code:</div>
              <div>{organisation.zip}</div>
            </div>
            <div className="flex justify-between bg-gray-100 py-2 px-4 rounded-md text-sm">
              <div className="font-semibold">BTW:</div>
              <div>{organisation.btw}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
