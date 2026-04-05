import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatbotRoute from "./routes/chatbot.js";
import path from "path";
import { fileURLToPath } from "url";

// 🔥 Fix __dirname (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Load .env from backend folder (IMPORTANT FIX)
dotenv.config({ path: path.join(__dirname, "../.env") });

// 🔍 Debug check (remove later)
console.log("API KEY:", process.env.OPENROUTER_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/chat", chatbotRoute);

// ✅ Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});