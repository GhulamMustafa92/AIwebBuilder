import React from "react";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.webp";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginModel({ open, onClose }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  if (!open) return null;

  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name: res.user.displayName,
          email: res.user.email,
          avatar: res.user.photoURL,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(data.user));
      toast.success("Login Successfylly🫡", {
        theme: "light",
        position: "top-center",
      });
      onClose()
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0B] p-8 shadow-2xl"
      >
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-xl text-gray-500 transition hover:text-white"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="logo"
            className="h-16 w-16 rounded-full hover:rotate-[720deg] transition-all duration-700 cursor-pointer"
          />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          AI-powered website builder
        </h2>

        <p className="mt-3 text-center text-gray-400">
          Welcome to{" "}
          <span className="font-semibold text-cyan-400">GenWeb.ai</span>
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleAuth}
          className="mt-10 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.02]"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Secure */}
        <div className="mt-6 flex justify-center">
          <span className="rounded-full border cursor-pointer border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            🔒 Secure Login
          </span>
        </div>

        {/* Terms */}
        <p className="mt-8 text-center text-xs leading-6 text-gray-500">
          By continuing, you agree to our{" "}
          <span className="cursor-pointer text-cyan-400 hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-cyan-400 hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </motion.div>
    </motion.div>
  );
}
