import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { AppRoutes } from "@/processes/routing/model/routes";

/** 보호된 라우트 컴포넌트 속성 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/** 인증 상태에 따라 라우트를 보호하는 컴포넌트 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  /**
   * 인증되지 않은 경우 로그인 페이지로 리다이렉트
   * 인증된 경우 요청된 컴포넌트 렌더링
   */
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={AppRoutes.LOGIN} replace />
  );
};
