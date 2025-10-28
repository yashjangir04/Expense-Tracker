import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Changepass from "./pages/Changepass";
import Employee from "./pages/Employee";
import Manager from "./pages/Manager";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}       // Start off-screen top
      animate={{ y: 0, opacity: 1 }}         // Slide down into view
      exit={{ y: -80, opacity: 0 }}          // Exit upward if unmounted
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[40px] bg-zinc-800 flex flex-row justify-center items-center gap-20 text-gray-200 fixed top-0 px-3 py-10 border-b border-b-[#8787870e] shadow-md z-50"
    >
      {/* Admin Links */}
      {role === "Admin" && (
        <>
          <Link to="/create">Create User</Link>
          <button
            className="bg-red-600 px-3 py-2 rounded-md cursor-pointer duration-300 hover:bg-red-700 absolute right-8"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}

      {/* Manager Links */}
      {role === "Manager" && (
        <>
          <Link to="/manager">Manager</Link>
          <button
            className="bg-red-600 px-3 py-2 rounded-md cursor-pointer duration-300 hover:bg-red-700 absolute right-8"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}

      {/* Employee Links */}
      {role === "Employee" && (
        <>
          <Link to="/employee">Employee</Link>
          <button
            className="bg-red-600 px-3 py-2 rounded-md cursor-pointer duration-300 hover:bg-red-700 absolute right-8"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}
    </motion.nav>
  );
};

const App = () => {
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      {/* ✅ AnimatePresence handles mount/unmount animations */}
      <AnimatePresence>{role && <Navbar key="navbar" />}</AnimatePresence>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create" element={<Create />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/changepass" element={<Changepass />} />
      </Routes>

      {/* Footer */}
      <div className="Footer w-full h-8 bg-zinc-900 flex justify-center items-center fixed bottom-0">
        <p className="text-sm text-zinc-500">
          © 2025 Expense Management System - Yash Jangir
        </p>
      </div>
    </BrowserRouter>
  );
};

export default App;
