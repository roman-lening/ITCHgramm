import express from "express";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.LOCAL_PORT || 3333;
const host = process.env.LOCAL_HOST || "localhost";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});
app.listen(port, host, () => {
  console.log("Сервер запущен");
});
