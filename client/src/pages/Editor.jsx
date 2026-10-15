import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { FaRobot, FaChevronLeft, FaChevronRight, FaCode } from "react-icons/fa";
import { FiCode, FiSend, FiCopy, FiEye, FiSave, FiMaximize, FiX } from "react-icons/fi";
import MonacoEditor from "@monaco-editor/react";
import { IoArrowBack } from "react-icons/io5";

function Header({ chatOpen, setChatOpen, title }) {
  return (
    <div className="h-16 px-4 sm:px-6 bg-[#111827] border-b border-gray-700 flex justify-between items-center">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-center items-center text-white transition-all duration-300 ease-in-out active:scale-90"
        >
          <span
            className={`transition-transform duration-300 ease-in-out ${
              chatOpen ? "rotate-0" : "rotate-180"
            }`}
          >
            {chatOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </span>
        </button>

        <div className="min-w-0">
          <h1 className="text-white text-base sm:text-xl font-bold truncate">
            {title}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
            AI Website Builder
          </p>
        </div>
      </div>

      <button className="bg-cyan-500 hover:bg-cyan-600 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-white text-sm sm:text-base transition-colors duration-200 shrink-0">
        Publish
      </button>
    </div>
  );
}

const CodeViewer = React.memo(function CodeViewer({ code, onChange }) {
  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="html"
      value={code}
      theme="vs-dark"
      onChange={(value) => onChange(value ?? "")}
      options={{
        readOnly: false,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
});

function ThinkingIndicator({ steps }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="p-3 rounded-xl text-sm bg-gray-800 mr-4 sm:mr-10 flex items-center gap-2">
      <span
        key={stepIndex}
        className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shine_2s_linear_infinite] font-medium"
      >
        {steps[stepIndex]}
      </span>
    </div>
  );
}

function FullscreenPreview({ previewUrl, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="h-12 sm:h-14 bg-[#111827] border-b border-gray-700 flex items-center justify-between px-4">
        <span className="text-white text-sm sm:text-base">Full Preview</span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-all duration-200 active:scale-90"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="flex-1">
        {previewUrl ? (
          <iframe
            title="fullscreen-preview"
            src={previewUrl}
            className="w-full h-full bg-white"
          />
        ) : null}
      </div>
    </div>
  );
}

// 👇 Fix — useNavigate() ab component ke top-level par call hota hai, JSX ke andar nahi
function Preview({
  showCode,
  setShowCode,
  copyCode,
  copied,
  editedCode,
  onCodeChange,
  previewUrl,
  isDirty,
  onSave,
  saving,
  onFullscreen,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-[300px] sm:min-h-0 bg-[#0b1120] flex flex-col">
      <div className="h-12 sm:h-14 border-b border-gray-700 px-3 sm:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <IoArrowBack className="text-cyan-400 text-2xl shrink-0" />
          <span
            onClick={() => !showCode && navigate("/dashboard")}
            className={`text-primary text-lg font-semibold sm:text-base truncate ${
              !showCode
                ? "cursor-pointer hover:text-cyan-400 transition-colors duration-200"
                : ""
            }`}
          >
            {showCode ? "Source Code" : "Dashboard"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!showCode && (
            <button
              onClick={onFullscreen}
              title="Full Preview"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-300 ease-in-out"
            >
              <FiMaximize />
            </button>
          )}

          <button
            onClick={() => setShowCode(false)}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm transition-all duration-300 ease-in-out ${
              !showCode ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            <FiEye />
          </button>

          <button
            onClick={() => setShowCode(true)}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm transition-all duration-300 ease-in-out ${
              showCode ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            <FaCode />
          </button>

          {showCode && (
            <>
              {isDirty && (
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 text-white text-sm transition-all duration-200 ease-in-out"
                >
                  <FiSave />
                  <span className="hidden sm:inline">
                    {saving ? "Saving..." : "Save"}
                  </span>
                </button>
              )}

              <button
                onClick={copyCode}
                className="bg-green-600 hover:bg-green-700 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 text-white text-sm transition-all duration-200 ease-in-out"
              >
                <FiCopy />
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 overflow-auto transition-opacity duration-300 ease-in-out ${
            showCode ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <CodeViewer code={editedCode || ""} onChange={onCodeChange} />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            !showCode ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {previewUrl ? (
            <iframe title="preview" src={previewUrl} className="w-full h-full bg-white" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Editor() {
  const { id } = useParams();

  const [website, setWebsite] = useState(null);
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");

  const [editedCode, setEditedCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  const [isFullscreen, setIsFullscreen] = useState(false);

  const thinkingSteps = [
    "Understanding Your Request...",
    "Planing Layout Changes...",
    "Improving Responsive...",
    "Applying animations...",
    "Finalizing update...",
  ];

  useEffect(() => {
    const handleWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true },
        );

        setWebsite(result.data.website);
        setEditedCode(result.data.website?.latestCode || "");
      } catch (error) {
        setErr(error.response?.data?.message || "Something went wrong");
      }
    };

    handleWebsite();
  }, [id]);

  useEffect(() => {
    if (!editedCode) return;

    const blob = new Blob([editedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [editedCode]);

  if (err) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#0f172a] text-red-500 text-xl px-4 text-center">
        {err}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#0f172a] text-white">
        Loading...
      </div>
    );
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(editedCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const isDirty = editedCode !== website.latestCode;

  const handleSaveCode = async () => {
    if (!isDirty || saving) return;

    setSaving(true);
    setSaveErr("");

    try {
      const result = await axios.put(
        `${serverUrl}/api/website/save-code/${id}`,
        { code: editedCode },
        { withCredentials: true },
      );

      setWebsite(result.data.website);
      setEditedCode(result.data.website.latestCode);
    } catch (error) {
      setSaveErr(error.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const sendUpdate = async () => {
    const prompt = message.trim();

    if (!prompt || sending) return;

    setSending(true);
    setSendErr("");

    setWebsite((prev) => ({
      ...prev,
      conversation: [...(prev.conversation || []), { role: "user", content: prompt }],
    }));
    setMessage("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt },
        { withCredentials: true },
      );

      setWebsite(result.data.website);
      setEditedCode(result.data.website.latestCode);
    } catch (error) {
      setSendErr(error.response?.data?.message || "Failed to update website");
      console.log(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendUpdate();
    }
  };

  return (
    <div className="h-screen bg-[#0f172a] flex flex-col">
      <style>
        {`
          @keyframes shine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}
      </style>

      <Header chatOpen={chatOpen} setChatOpen={setChatOpen} title={website.title} />

      <div className="w-full flex-1 flex flex-col md:flex-row overflow-hidden">
        <div
          className={`bg-[#111827] border-b md:border-b-0 md:border-r border-gray-700 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
            chatOpen
              ? "h-72 sm:h-80 md:h-auto md:w-[360px] opacity-100"
              : "h-0 md:w-0 opacity-0"
          }`}
        >
          <div
            className={`w-full md:w-[360px] flex flex-col h-full transition-opacity duration-300 ease-in-out ${
              chatOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="p-3 sm:p-4 border-b border-gray-700 flex items-center gap-2">
              <FaRobot className="text-cyan-400 text-xl shrink-0" />
              <h2 className="text-white font-semibold text-sm sm:text-base">
                AI Assistant
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {website.conversation?.map((item, index) => (
                <div
                  key={index}
                  className={`p-2.5 sm:p-3 rounded-xl text-sm transition-all duration-300 ease-in-out break-words ${
                    item.role === "user"
                      ? "bg-cyan-500 text-white ml-4 sm:ml-10"
                      : "bg-gray-800 text-gray-200 mr-4 sm:mr-10"
                  }`}
                >
                  {item.content}
                </div>
              ))}

              {sending && <ThinkingIndicator steps={thinkingSteps} />}
            </div>

            {sendErr && (
              <div className="px-3 sm:px-4 py-2 text-red-400 text-xs">
                {sendErr}
              </div>
            )}
            {saveErr && (
              <div className="px-3 sm:px-4 py-2 text-red-400 text-xs">
                {saveErr}
              </div>
            )}

            <div className="p-3 sm:p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-[#1f2937] rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-white text-sm sm:text-base outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50"
                  placeholder="Describe changes..."
                  value={message}
                  disabled={sending}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button
                  onClick={sendUpdate}
                  disabled={sending || !message.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed p-2.5 sm:p-3 rounded-lg transition-colors duration-200 active:scale-90 shrink-0"
                >
                  <FiSend className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Preview
          showCode={showCode}
          setShowCode={setShowCode}
          copyCode={copyCode}
          copied={copied}
          editedCode={editedCode}
          onCodeChange={setEditedCode}
          previewUrl={previewUrl}
          isDirty={isDirty}
          onSave={handleSaveCode}
          saving={saving}
          onFullscreen={() => setIsFullscreen(true)}
        />
      </div>

      {isFullscreen && (
        <FullscreenPreview
          previewUrl={previewUrl}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}

export default Editor;