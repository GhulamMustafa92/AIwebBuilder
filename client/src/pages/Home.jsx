import React from "react";
import { motion } from "motion/react";
import logo from "../assets/logo.webp";
import { useState } from "react";
import Hamburger from "hamburger-react";
import LoginModel from "../components/LoginModel";
import { useDispatch, useSelector } from "react-redux";
import { FaUserAstronaut } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const highLights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];

  const { userData } = useSelector((state) => state.user);
  const [openLogin, setOpenLogin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (userData) {
      navigate("/dashboard");
    } else {
      setOpenLogin(true);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.error("Logout Successfylly😡", {
        position: "top-center",
      });
    } catch (err) {
      console.log("logout error", err);
    }
  };

  return (
    <div className="text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className=" group flex items-center gap-3 cursor-pointer">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover transition-transform duration-700 group-hover:rotate-[720deg]"
            />

            <h1 className="text-2xl font-bold tracking-wide uppercase">
              gen web
            </h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
            <li className="cursor-pointer text-gray-400 transition hover:text-white">
              Pricing
            </li>

            <li className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-300 backdrop-blur-xl transition hover:border-cyan-400/40 hover:text-white">
              🪙 Credits{" "}
              <span className="font-semibold text-cyan-400">
                {userData?.credits ?? 0}+
              </span>
            </li>

            {!userData ? (
              <button onClick={handleGetStarted} className="button">
                Get Started
              </button>
            ) : (
              <div className="group relative">
                {/* Profile */}
                <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                      <FaUserAstronaut size={18} />
                    </div>
                  )}

                  <div className="text-left">
                    <p className="max-w-[120px] truncate text-sm font-semibold text-white">
                      {userData?.name || "Guest"}
                    </p>
                  </div>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 top-14 w-48 rounded-2xl border border-white/10 bg-[#111]/95 backdrop-blur-xl opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
                  <div className="border-b border-white/10 px-5 py-4">
                    <h3 className="font-semibold text-white">
                      {userData?.name}
                    </h3>

                    <p className="truncate text-sm text-gray-400">
                      {userData?.email}
                    </p>
                  </div>

                  <button onClick={()=>navigate("/dashboard")} className="w-full px-5 py-3 text-left text-gray-300 transition hover:bg-white/10 hover:text-cyan-400">
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogOut}
                    className="w-full px-5 py-3 text-left text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </ul>

          {/* Mobile Icon */}
          <div
            className="md:hidden text-2xl cursor-pointer text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Hamburger toggled={menuOpen} toggle={setMenuOpen} />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-black overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-screen py-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-6 px-6">
            <p className="text-gray-300 cursor-pointer">Pricing</p>

            <div className="rounded-full border border-gray-600 px-4 py-2 text-gray-300">
              🪙 Credits
              <span className="ml-1 text-cyan-400 font-semibold">
                {userData?.credits ?? 0}+
              </span>
            </div>

            {!userData ? (
              <button onClick={handleGetStarted} className="button">
                Get Started
              </button>
            ) : (
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full max-w-xs cursor-pointer rounded-xl border border-white/10 bg-white/5 p-3"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                      <FaUserAstronaut size={20} />
                    </div>
                  )}

                  <div className="min-w-0 text-left">
                    <p className="truncate font-semibold text-white">
                      {userData?.name || "Guest"}
                    </p>
                    <p className="truncate text-sm text-gray-400">
                      {userData?.email || "Signed in"}
                    </p>
                  </div>
                </div>

                {profileOpen && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/dashboard");
                      }} 
                      className="mt-4 w-full rounded-lg py-2 hover:bg-white/10 text-left px-3"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogOut();
                      }}
                      className="mt-2 w-full rounded-lg py-2 text-red-400 hover:bg-red-500/10 text-left px-3"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center h-[700px] text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl"
        >
          Build Stunning Websites
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            with AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-gray-400"
        >
          Describe your idea and let AI generate a modern, responsive,
          production-ready website in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-10"
        >
          <button className="button" onClick={handleGetStarted}>
            {userData ? "Go to Dashboard" : "Get Started"}
          </button>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highLights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border hover:border-primary bg-white/5 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-[0_0_35px_rgba(9, 203, 233, 0.76)]"
            >
              {/* Glow */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl group-hover:bg-cyan-400/20 transition-all duration-500"></div>

              {/* Number */}
              <span className="text-5xl font-bold text-primary">0{i + 1}</span>

              {/* Title */}
              <h2 className="mt-5 text-2xl font-bold text-white">{h}</h2>

              {/* Description */}
              <p className="mt-4 text-gray-400 leading-7">
                GenWeb.ai builds modern, responsive and AI-powered websites with
                clean architecture, premium animations and scalable development.
              </p>

              {/* Bottom Line */}
              <div className="mt-8 h-[2px] w-12 bg-primary transition-all duration-500 group-hover:w-full"></div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mt-24 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <img
              src={logo}
              alt="GenWeb Logo"
              className="w-10 h-10 rounded-full object-cover transition-transform duration-700 group-hover:rotate-[720deg]"
            />
            <h2 className="text-xl font-bold tracking-wide uppercase">
              Gen Web
            </h2>
          </div>

          {/* Links */}
          <ul className="flex items-center gap-8 text-gray-400 text-sm">
            <li className="cursor-pointer transition hover:text-cyan-400 group">
              Home
              <div className="mt-1 h-[2px] w-1 bg-primary transition-all duration-500 group-hover:w-full"></div>
            </li>
            <li className="cursor-pointer transition hover:text-cyan-400 group">
              Pricing
              <div className="mt-1 h-[2px] w-1 bg-primary transition-all duration-500 group-hover:w-full"></div>
            </li>
            <li className="cursor-pointer transition hover:text-cyan-400 group">
              Features
              <div className="mt-1 h-[2px] w-1 bg-primary transition-all duration-500 group-hover:w-full"></div>
            </li>
            <li className="cursor-pointer transition hover:text-cyan-400 group">
              Contact
              <div className="mt-1 h-[2px] w-1 bg-primary transition-all duration-500 group-hover:w-full"></div>
            </li>
          </ul>

          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center md:text-right">
            © {new Date().getFullYear()}{" "}
            <span className="group inline-block cursor-pointer">
              <span className="font-semibold text-white hover:text-primary transition-all duration-700">
                GenWeb AI
              </span>

              <span className="block h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
            </span>
            . All rights reserved.
          </p>
        </div>
      </footer>

      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
      <ToastContainer />
    </div>
  );
}