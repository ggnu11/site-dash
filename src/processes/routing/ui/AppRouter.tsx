import { ProtectedRoute } from "@/processes/routing/lib/ProtectedRoute";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import React from "react";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";

// 페이지 컴포넌트 임포트
import LoginPage from "@/pages/LoginPage";
import SiteDash from "@/SiteDash";

/** 루트 리다이렉트 컴포넌트 */
const RootRedirect: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

/** 애플리케이션 라우터 컴포넌트 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="login" element={<LoginPage />} />

        {/* 대시보드 (보호된 라우트) */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <SiteDash />
            </ProtectedRoute>
          }
        />

        {/* 루트 경로 처리 - 인증 상태에 따라 리다이렉트 */}
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
};
