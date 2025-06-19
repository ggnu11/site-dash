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
      const success = await login(validatedData.email, validatedData.password);

      if (success) {
        navigate("/dashboard");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?
            <RegisterDialog />
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
