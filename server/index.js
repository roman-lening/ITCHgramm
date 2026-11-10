import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import getsRouter from "./routes/gets.js";
import postsRouter from "./routes/posts.js";
import patchsRouter from "./routes/patchs.js";
import deletesRouter from "./routes/deletes.js";
dotenv.config();
const port = process.env.PORT || process.env.LOCAL_PORT || 3333;
const host = "0.0.0.0";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://itchgram.de",
        "https://itchgramm.vercel.app",
        "http://localhost:5173",
      ];
      const isVercelDeployment =
        /^https:\/\/itchgramm-[a-z0-9-]+-roman-lening\.vercel\.app$/.test(
          origin || "",
        );
      if (!origin || allowedOrigins.includes(origin) || isVercelDeployment) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());
app.use(getsRouter);
app.use(postsRouter);
app.use(patchsRouter);
app.use(deletesRouter);
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});
async function startServer() {
  try {
    await connectDB();
    app.listen(port, host, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
