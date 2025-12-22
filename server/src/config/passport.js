import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

// 환경변수 로드
dotenv.config();

// Google OAuth 전략 설정
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:5001"}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // MongoDB 연결 상태 확인
          const mongoose = await import("mongoose");
          const readyState = mongoose.default.connection.readyState;

          // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
          if (readyState !== 1) {
            console.error(
              "❌ MongoDB is not connected. ReadyState:",
              readyState,
              "(0=disconnected, 1=connected, 2=connecting, 3=disconnecting)"
            );

            // 연결 중이면 잠시 대기 후 재시도
            if (readyState === 2) {
              console.log("⏳ MongoDB is connecting, waiting...");
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // 다시 확인
              if (mongoose.default.connection.readyState !== 1) {
                return done(
                  new Error(
                    "Database connection is not available. Please check if MongoDB is running."
                  ),
                  null
                );
              }
            } else {
              return done(
                new Error(
                  "Database connection is not available. Please check if MongoDB is running."
                ),
                null
              );
            }
          }

          // 기존 사용자 찾기
          let user = await User.findOne({ googleId: profile.id }).maxTimeMS(
            10000
          );

          if (user) {
            return done(null, user);
          }

          // 같은 이메일로 가입된 사용자가 있는지 확인
          user = await User.findOne({
            email: profile.emails[0].value,
          }).maxTimeMS(10000);

          if (user) {
            // 기존 계정에 googleId 추가
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }

          // 새 사용자 생성
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username:
              profile.displayName || profile.emails[0].value.split("@")[0],
            // password는 설정하지 않음 (구글 로그인 사용자)
          });

          await user.save();
          done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
          // 타임아웃 오류인 경우 더 명확한 메시지
          if (error.message && error.message.includes("buffering timed out")) {
            console.error(
              "❌ MongoDB connection timeout. Please check your database connection."
            );
            return done(
              new Error("Database connection timeout. Please try again later."),
              null
            );
          }
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️  Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file."
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // MongoDB 연결 상태 확인
    const mongoose = await import("mongoose");
    if (mongoose.default.connection.readyState !== 1) {
      return done(new Error("Database connection is not available"), null);
    }

    const user = await User.findById(id).maxTimeMS(10000);
    done(null, user);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

export default passport;
