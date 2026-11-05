import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
const port = process.env.PORT || process.env.LOCAL_PORT || 3333;
const host = "0.0.0.0";
const app = express();
app.use(
  cors({
    origin: [
      "https://itchgramm.vercel.app",
      "http://localhost:5173",
    ],
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});
async function startServer() {
  try {
    await connectDB();
    app.listen(port, host,  () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
