import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "./config/database.js";
import { supabase } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import sitesRoutes from "./routes/sites.js";
import passport from "./config/passport.js";

// 환경변수 로드
dotenv.config();

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

// 세션 설정
const isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "site_dash_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // 프로덕션에서만 HTTPS 사용
      httpOnly: true, // XSS 공격 방지
      sameSite: isProduction ? "none" : "lax", // 프로덕션에서 CORS 쿠키 허용
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    },
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

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

// 헬스체크 엔드포인트 (Railway 헬스체크용 - 빠른 응답)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// 서버를 먼저 시작 (Railway 헬스체크를 위해)
// 0.0.0.0으로 바인딩하여 외부에서 접근 가능하도록 설정
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://0.0.0.0:${PORT}/api`);
  console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
  
  // 서버 시작 후 비동기로 데이터베이스 연결 시도
  connectDB().then(() => {
    console.log("✅ Supabase connection initialized");
  }).catch((error) => {
    console.error("❌ Failed to initialize Supabase connection:", error);
    console.warn("⚠️  Server is running without database connection. Some features may not work.");
  });
});
