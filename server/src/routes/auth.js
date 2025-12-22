import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Google OAuth 로그인 시작
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth 콜백
router.get(
  "/google/callback",
  (req, res, next) => {
    // OAuth 오류 처리
    passport.authenticate("google", {
      session: false,
      failureRedirect: undefined, // 수동으로 처리
    })(req, res, (err) => {
      if (err) {
        console.error("Google OAuth authentication error:", err);

        // invalid_grant 오류는 보통 코드가 재사용되었거나 만료된 경우
        if (err.code === "invalid_grant") {
          return res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/#/login?error=oauth_code_expired`
          );
        }

        // 데이터베이스 연결 오류
        if (err.message && err.message.includes("Database connection")) {
          return res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/#/login?error=database_connection_failed`
          );
        }

        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:5173"}/#/login?error=google_auth_failed`
        );
      }

      if (!req.user) {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:5173"}/#/login?error=user_not_found`
        );
      }

      next();
    });
  },
  (req, res) => {
    try {
      // JWT 토큰 생성
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // 프론트엔드로 리다이렉트하면서 토큰 전달
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/#/login?token=${token}&userId=${req.user._id}&email=${encodeURIComponent(req.user.email)}&username=${encodeURIComponent(req.user.username)}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/#/login?error=token_generation_failed`
      );
    }
  }
);

// 사용자 정보 조회
router.get("/me", authenticateToken, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    },
  });
});

// 로그아웃
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // JWT는 stateless이므로 서버 측에서 특별한 작업이 필요 없음
    // 클라이언트에서 토큰을 삭제하면 됨
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

// 회원탈퇴
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // 사용자 삭제
    await User.findByIdAndDelete(userId);

    console.log(`User ${userId} account deleted`);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

export default router;
