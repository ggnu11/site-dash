import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { AppRoutes } from "@/processes/routing/model/routes";

/** 로그인 스키마 */
const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

/** 회원가입 스키마 */
const registerSchema = z.object({
  username: z.string().min(2, "사용자 이름은 최소 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

/** 로그인 페이지 컴포넌트 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  /** 로그인 핸들러 */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const validatedData = loginSchema.parse({ email, password });

      // TODO: 실제 로그인 로직 구현
      if (
        validatedData.email === "test@example.com" &&
        validatedData.password === "password123"
      ) {
        navigate(AppRoutes.DASHBOARD);
      } else {
        setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  /** 회원가입 다이얼로그 컴포넌트 */
  const RegisterDialog: React.FC = () => {
    const [username, setUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerError, setRegisterError] = useState("");
    const { register } = useAuthStore();

    /** 회원가입 핸들러 */
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setRegisterError("");

      try {
        const validatedData = registerSchema.parse({
          username,
          email: registerEmail,
          password: registerPassword,
        });

        const success = await register(
          validatedData.email,
          validatedData.password,
          validatedData.username
        );

        if (success) {
          navigate("/dashboard");
        } else {
          setRegisterError("회원가입에 실패했습니다.");
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          setRegisterError(err.errors[0].message);
        } else {
          setRegisterError("회원가입 중 오류가 발생했습니다.");
        }
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">회원가입</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회원가입</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder="사용자 이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="이메일"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            {registerError && (
              <p className="text-red-500 text-sm">{registerError}</p>
            )}
            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-left mb-8">
          <span className="text-yellow-500 text-sm font-medium">WELCOME</span>
          <h1 className="text-4xl font-bold text-white mt-2">로그인</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#2A2A2A] text-white border-[#404040] focus:border-yellow-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
          >
            로그인
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-400 text-sm">
            계정이 없으신가요?
            <RegisterDialog />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
