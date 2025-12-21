import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import sitesRoutes from "./routes/sites.js";

// 환경변수 로드
dotenv.config();

// 데이터베이스 연결
connectDB();

const app = express();

// 미들웨어
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 라우트
app.use("/api/auth", authRoutes);
app.use("/api/sites", sitesRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "Site Dash API Server" });
});

// 404 핸들러
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 에러 핸들러
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
