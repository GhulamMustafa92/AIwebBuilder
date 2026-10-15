import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dns from 'dns'
import authRoutes from "./routes/auth.routes.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from "./routes/user.routes.js";
import websitRoutes from "./routes/website.routes.js";

dns.setServers(["1.1.1.1","8.8.8.8"])
const app = express();
dotenv.config();

const port = process.env.PORT || 4000;
const configuredClientUrl = process.env.CLIENT_URL;

if (process.env.NODE_ENV === "production" && !configuredClientUrl) {
  throw new Error("CLIENT_URL must be configured in production");
}

const clientOrigins = (configuredClientUrl || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: clientOrigins,
    credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/user",userRouter)
app.use("/api/website",websitRoutes)

app.listen(port, () => {
  console.log(`server started on ${port}`);
  connectDB().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

});
