import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    country: "",
  });
  let [countries, setCountries] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/company/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Response:", data);
  };

  useEffect(() => {
    const getCountries = async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,currencies",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setCountries(data);
    };

    getCountries();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-700 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none"
          >
            <option value="">Select a country</option>
            {countries.map((c) => {
              const currencyCode = Object.keys(c.currencies)[0];
              const countryName = c.name.common;
              return (
                <option
                  key={`${countryName}-${currencyCode}`}
                  value={currencyCode}
                >
                  {countryName} ({currencyCode})
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 rounded-md transition-colors duration-200"
        >
          Sign Up
        </button>

        <p className="text-sm text-zinc-300 mt-4 text-center">
          Already an User?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
