import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/msg", messageRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLO THERE" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port: ${PORT}`);
});
