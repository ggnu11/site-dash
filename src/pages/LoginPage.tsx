import { AppRoutes } from "@/processes/routing/model/routes";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

/** 로그인 스키마 */
const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

/** 로그인 페이지 컴포넌트 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 이메일 입력란에 포커스
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  /** 로그인 핸들러 */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const validatedData = loginSchema.parse({ email, password });

      // 로그인 애니메이션 효과 추가
      const loginButton = e.currentTarget.querySelector("button");
      if (loginButton) {
        loginButton.classList.add("animate-pulse");

        setTimeout(() => {
          loginButton.classList.remove("animate-pulse");

          // TODO: 실제 로그인 로직 구현
          if (
            validatedData.email === "test@example.com" &&
            validatedData.password === "password123"
          ) {
            navigate(AppRoutes.DASHBOARD);
          } else {
            setError(
              "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
            );
          }
        }, 1000);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  /** 회원가입 모달 */
  const RegisterModal = () => {
    const [username, setUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerError, setRegisterError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setRegisterError("");

      try {
        // TODO: 실제 회원가입 로직 구현
        const registerButton = e.currentTarget.querySelector("button");
        if (registerButton) {
          registerButton.classList.add("animate-pulse");

          setTimeout(() => {
            registerButton.classList.remove("animate-pulse");
            alert(`회원가입 시도: ${username}, ${registerEmail}`);
            setIsRegisterModalOpen(false);
          }, 1000);
        }
      } catch (err) {
        setRegisterError("회원가입 중 오류가 발생했습니다.");
      }
    };

    return (
      <AnimatePresence>
        {isRegisterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsRegisterModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full max-w-md bg-[#2A2A2A] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
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
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    회원가입
                  </h2>
                  <p className="text-sm text-white/60">
                    새로운 계정을 만드세요
                  </p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      사용자 이름
                    </label>
                    <Input
                      type="text"
                      placeholder="사용자 이름을 입력하세요"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-[#1E1E1E] text-white border-white/20 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      이메일
                    </label>
                    <Input
                      type="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-[#1E1E1E] text-white border-white/20 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      비밀번호
                    </label>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="bg-[#1E1E1E] text-white border-white/20 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </motion.div>
                  {registerError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {registerError}
                    </motion.p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-600 transition-colors duration-300 ease-in-out"
                  >
                    회원가입
                  </Button>
                </form>
                <div className="text-center">
                  <p className="text-sm text-white/60">
                    이미 계정이 있으신가요?{" "}
                    <button
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="text-yellow-500 hover:underline font-medium"
                    >
                      로그인
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-[#2A2A2A] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-8 space-y-6">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
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
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">로그인</h1>
            <p className="text-sm text-white/60">
              사이트 대시보드에 접속하세요
            </p>
          </motion.div>
          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">
                이메일
              </label>
              <Input
                ref={emailInputRef}
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1E1E1E] text-white border-white/20 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">
                비밀번호
              </label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1E1E1E] text-white border-white/20 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </motion.div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </motion.p>
            )}
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-black hover:bg-yellow-600 transition-colors duration-300 ease-in-out"
            >
              로그인
            </Button>
          </form>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-sm text-white/60">
              계정이 없으신가요?{" "}
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="text-yellow-500 hover:underline font-medium"
              >
                회원가입
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      <RegisterModal />
    </motion.div>
  );
};

export default LoginPage;
