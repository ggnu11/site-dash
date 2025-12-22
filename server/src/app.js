import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "./config/database.js";
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

// 데이터베이스 연결이 완료된 후 서버 시작
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connection initialized");
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize database connection:", error);
    console.warn("⚠️  Starting server without database connection...");
    
    // 데이터베이스 연결 실패해도 서버는 시작 (일부 기능만 작동하지 않음)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (without database)`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
      console.warn("⚠️  Some features requiring database will not work.");
    });
  }
})();
