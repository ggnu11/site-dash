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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
              className="bg-[#1E1E1E] rounded-2xl p-8 w-full max-w-md border border-[#404040] shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="text-yellow-500 mr-3">✦</span>
                회원가입
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input
                    type="text"
                    placeholder="사용자 이름"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    type="email"
                    placeholder="이메일"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    type="password"
                    placeholder="비밀번호"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
                  />
                </motion.div>
                {registerError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm"
                  >
                    {registerError}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-600 group"
                >
                  회원가입
                </Button>
              </form>
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
      className="min-h-screen bg-[#1E1E1E] flex items-center justify-center"
    >
      <div className="w-full max-w-md p-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-8"
        >
          <span className="text-yellow-500 text-sm font-medium">WELCOME</span>
          <h1 className="text-4xl font-bold text-white mt-2">로그인</h1>
        </motion.div>
        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Input
              ref={emailInputRef}
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
            />
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}
          <Button
            type="submit"
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600 group"
          >
            로그인
          </Button>
        </form>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <span className="text-gray-400 text-sm">
            계정이 없으신가요?
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="ml-2 text-yellow-500 hover:underline"
            >
              회원가입
            </button>
          </span>
        </motion.div>
      </div>

      <RegisterModal />
    </motion.div>
  );
};

export default LoginPage;
