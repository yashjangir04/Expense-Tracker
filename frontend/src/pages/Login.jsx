import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/users/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    let role = data.role ;
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", role);

    if(role === "Employee") {
      navigate("/employee"); 
    }
    else if(role === "Manager") {
      navigate("/manager"); 
    }
    else {
      navigate("/create"); 
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-700 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

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

        <div className="mb-6">
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

        <button
          type="submit"
          className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 rounded-md transition-colors duration-200 mb-4"
        >
          Login
        </button>

        {/* Forgot password */}
        <div className="text-center">
          <Link
            to="/changepass"
            className="text-sm text-zinc-300 hover:text-white underline mb-5"
          >
            Forgot Password?
          </Link>

          {/* Sign Up link */}
          <p className="text-sm text-zinc-300 mt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
