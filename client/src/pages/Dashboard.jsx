import React, { useEffect, useState } from "react";
import { FiShare2, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";

// 👇 Nayi cheez — website ka live scaled-down preview dikhata hai (screenshot na hone ki wajah se)
function WebsiteThumbnail({ code }) {
  if (!code) {
    return (
      <div className="h-44 w-full flex items-center justify-center bg-gray-800 text-gray-500 text-sm">
        No Preview
      </div>
    );
  }

  return (
    <div className="relative h-44 w-full overflow-hidden bg-white">
      <iframe
        title="website-thumbnail"
        srcDoc={code}
        loading="lazy"
        sandbox=""
        className="pointer-events-none origin-top-left"
        style={{
          width: "400%",
          height: "400%",
          transform: "scale(0.25)",
          border: "none",
        }}
      />
    </div>
  );
}

export default function Dashboard() {
  const [websites, setWebsites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGetAllWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data.websites || []);
      } catch (err) {
        console.log(err);
        setWebsites([]);
      } finally {
        setLoading(false);
      }
    };

    handleGetAllWebsite();
  }, []);

  const handleShare = (id) => {
    const link = `${window.location.origin}/editor/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#111827] to-black text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-primary transition-colors duration-200">
            <IoArrowBack size={24} onClick={() => navigate("/")} />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
          </div>

          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            <FiPlus />
            New Website
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-gray-400 tracking-wide">Welcome Back 👋</p>

        <h1 className="mt-2 text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
          {userData?.name}
        </h1>

        <p className="mt-3 text-gray-500">
          Manage your AI generated websites from one place.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="mt-56 flex justify-center">
            <p className="text-gray-400 loader"></p>
          </div>
        )}

        {/* Projects */}
        {!loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites?.map((site) => (
              <div
                key={site._id}
                className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/60 hover:shadow-cyan-500/10"
              >
                <div className="overflow-hidden rounded-2xl">
                  <WebsiteThumbnail code={site.latestCode} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-white truncate">
                  {site.title}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Last Updated: {formatDate(site.updatedAt)}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/editor/${site._id}`)}
                    className="rounded-lg bg-cyan-500 px-4 py-2 font-medium shadow-md shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => handleShare(site._id)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-gray-300 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <FiShare2 />
                    {copiedId === site._id ? "Copied!" : "Share"}
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Card */}
            <div
              onClick={() => navigate("/generate")}
              className="flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-500/40 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
            >
              <div className="rounded-full bg-cyan-500 p-4 shadow-lg shadow-cyan-500/30 transition-transform duration-300 hover:scale-110">
                <FiPlus size={30} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Create New Website
              </h2>

              <p className="mt-2 text-center text-gray-400">
                Generate a new AI website in seconds.
              </p>
            </div>
          </div>
        )}

        {/* No Websites Empty State */}
        {!loading && websites?.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            You haven't created any websites yet — click the card above to get started.
          </p>
        )}
      </div>
    </div>
  );
}