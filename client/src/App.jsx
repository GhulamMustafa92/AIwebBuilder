import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/getCurrentUser";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Editor from "./pages/Editor";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
export const serverUrl = apiUrl.replace(/\/+$/, "");

export default function App() {
  useGetCurrentUser();

  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={userData ? <Dashboard /> : <Home/>}/>
          <Route path="/generate" element={userData ? <Generate /> : <Home/>}/>
          <Route path="/editor/:id" element={userData ? <Editor /> : <Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
