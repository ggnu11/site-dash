import { useAuthStore } from "@/entities/auth/model/auth.store";
import { AppRoutes } from "@/processes/routing/model/routes";
import { Button } from "@/shared/ui/button";
import { showError, showSuccess } from "@/shared/lib/toast";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** 로그인 페이지 컴포넌트 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setGoogleAuth } = useAuthStore();

  // 이미 인증된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      console.log(
        "✅ [LoginPage] Already authenticated, redirecting to dashboard"
      );
      navigate(AppRoutes.DASHBOARD, { replace: true });
    } else {
      console.log("ℹ️ [LoginPage] Not authenticated, showing login page");
    }
  }, [isAuthenticated, navigate]);

  // Google OAuth 콜백 처리
  useEffect(() => {
    // HashRouter를 사용하므로 해시에서 쿼리 파라미터를 추출해야 함
    const hash = window.location.hash;
    const hashPath = hash.split("?")[0]; // #/login 부분
    const hashQuery = hash.includes("?") ? hash.split("?")[1] : "";

    console.log("🔍 [LoginPage] Parsing hash:", { hash, hashPath, hashQuery });

    const urlParams = new URLSearchParams(hashQuery || window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const email = urlParams.get("email");
    const username = urlParams.get("username");
    const errorParam = urlParams.get("error");

    console.log("🔍 [LoginPage] Extracted params:", {
      hasToken: !!token,
      hasUserId: !!userId,
      hasEmail: !!email,
      hasUsername: !!username,
      hasError: !!errorParam,
    });

    if (errorParam) {
      let errorMessage = "구글 로그인에 실패했습니다. 다시 시도해주세요.";

      // 오류 타입에 따른 메시지 설정
      switch (errorParam) {
        case "oauth_code_expired":
          errorMessage = "인증 코드가 만료되었습니다. 다시 로그인해주세요.";
          break;
        case "database_connection_failed":
          errorMessage =
            "데이터베이스 연결에 실패했습니다. 서버 관리자에게 문의하세요.";
          break;
        case "google_auth_failed":
          errorMessage = "구글 로그인에 실패했습니다. 다시 시도해주세요.";
          break;
        case "token_generation_failed":
          errorMessage = "토큰 생성에 실패했습니다. 다시 시도해주세요.";
          break;
        case "user_not_found":
          errorMessage = "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.";
          break;
        default:
          errorMessage = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
      }

      showError(errorMessage);
      // URL에서 에러 파라미터 제거 (해시 라우터 사용)
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + "#/login"
      );
      return;
    }

    if (token && userId && email && username) {
      try {
        console.log("🔐 [LoginPage] Google OAuth callback received:", {
          token: token.substring(0, 20) + "...",
          userId,
          email,
          username,
        });

        const user = {
          id: userId,
          email: decodeURIComponent(email),
          username: decodeURIComponent(username),
        };

        // Zustand 스토어를 통해 인증 상태 설정
        setGoogleAuth(token, user);
        console.log("✅ [LoginPage] Auth state set, waiting for persist...");
        showSuccess("로그인에 성공했습니다!");

        // persist 미들웨어가 localStorage에 저장하는 시간을 고려
        // 전체 페이지 새로고침을 통해 상태를 확실히 반영
        setTimeout(() => {
          console.log(
            "🚀 [LoginPage] Redirecting to dashboard with full page reload"
          );
          // 해시 라우터를 사용하므로 #/dashboard로 리다이렉트
          window.location.href =
            window.location.origin + window.location.pathname + "#/dashboard";
        }, 300);
      } catch (error) {
        console.error(
          "❌ [LoginPage] Error processing Google login callback:",
          error
        );
        showError("로그인 처리 중 오류가 발생했습니다.");
      }
    }
  }, [navigate, setGoogleAuth]);

  /** Google 로그인 핸들러 */
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
        className="w-full max-w-md bg-[#2A2A2A] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 150,
                  damping: 10,
                }}
                className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-500"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </motion.div>
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="text-4xl font-bold text-white mb-2"
            >
              로그인
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="text-sm text-white/60"
            >
              Google 계정으로 로그인하세요
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
          >
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black hover:bg-gray-100 transition-colors duration-300 ease-in-out flex items-center justify-center gap-3 py-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-lg font-medium">Google로 로그인</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
