import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

const Changepass = () => {
  const [formData, setFormData] = useState({
    email: "",
    tempPassword: "",
    newPassword: "",
    companyEmail: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    const res = await fetch('http://localhost:3000/users/api/changepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log(data);
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-700 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Change Password
        </h2>

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
          <label className="block mb-2 text-sm font-medium">Company Email</label>
          <input
            type="text"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
            required="68f5ef539387b0299e7afe81"
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Temporary Password
          </label>
          <input
            type="password"
            name="tempPassword"
            value={formData.tempPassword}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 rounded-md transition-colors duration-200 mb-2 cursor-pointer"
        >
          Change Password
        </button>
        <p className="text-sm text-zinc-300 text-center">
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

export default Changepass;
