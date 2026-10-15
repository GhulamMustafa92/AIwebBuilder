import React, { useState, useEffect, useRef } from "react";
import { FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const progressInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const handleGenerateWebsite = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setProgress(1);

    // 👇 Simulate progress: dheere dheere 95% tak barhta hai, asal response ka wait karta hai
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = prev < 50 ? 4 : prev < 80 ? 2 : 0.5;
        return Math.min(prev + increment, 95);
      });
    }, 400);

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true },
      );
      console.log(result);

      clearInterval(progressInterval.current);
      setProgress(100);

      if (result.data?.websiteId) {
        setTimeout(() => {
          navigate(`/editor/${result.data.websiteId}`);
        }, 400);
      }
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      console.log("URL:", `${serverUrl}/api/website/generate`);
      setError(err.response?.data?.message || "Failed to generate website");
      clearInterval(progressInterval.current);
      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#111827] to-black text-white py-16">
      <style>
        {`
          .loader {
            width: 24px;
            aspect-ratio: 1;
            border-radius: 50%;
            padding: 3px;
            background:
              radial-gradient(farthest-side,#ffffff 95%,#0000) 50% 0/6px 6px no-repeat,
              radial-gradient(farthest-side,#0000 calc(100% - 3px),#ffffff calc(100% - 2px)) content-box;
            animation: l6 1s infinite;
            -webkit-mask: linear-gradient(#0000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
          }
          @keyframes l6 { to { transform: rotate(1turn); } }
        `}
      </style>

      <div className="w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 shadow-md shadow-cyan-500/10 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30 mb-6 cursor-pointer"
        >
          <FiZap />
          Powered by Real AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent"
        >
          Build Websites with Real AI Power
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-gray-400"
        >
          This process may take a few minutes because GenWeb AI carefully plans
          and generates every part of your website.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl shadow-black/20 text-left"
        >
          <label className="text-sm font-medium text-gray-300">
            Describe your website
          </label>

          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            disabled={loading}
            rows={6}
            placeholder="Describe your website in detail..."
            className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 disabled:opacity-50"
          />

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}

          <motion.button
            onClick={handleGenerateWebsite}
            disabled={loading || !prompt.trim()}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500"
          >
            {loading ? (
              <>
                <span className="loader"></span>
                Generating...
              </>
            ) : (
              <>
                <FiZap />
                Generate Website
              </>
            )}
          </motion.button>

          {/* 👇 Naya — determinate progress bar, 1% se 100% tak */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                {Math.round(progress)}% — Generating your website...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}