import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";
import { supabase } from "../config/database.js";

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
          if (!supabase) {
            return done(
              new Error("Database connection is not available. Please check if Supabase is configured."),
              null
            );
          }

          // 기존 사용자 찾기 (Google ID로)
          let user = await User.findByGoogleId(profile.id);

          if (user) {
            return done(null, user);
          }

          // 같은 이메일로 가입된 사용자가 있는지 확인
          user = await User.findByEmail(profile.emails[0].value);

          if (user) {
            // 기존 계정에 googleId 추가
            user = await User.update(user.id, { google_id: profile.id });
            return done(null, user);
          }

          // 새 사용자 생성
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName || profile.emails[0].value.split("@")[0],
            // password는 설정하지 않음 (구글 로그인 사용자)
          });

          done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
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
    if (!supabase) {
      return done(new Error("Database connection is not available"), null);
    }

    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

export default passport;
