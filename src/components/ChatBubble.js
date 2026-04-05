import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatbotRoute from "./routes/chatbot.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/chat", chatbotRoute);

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
