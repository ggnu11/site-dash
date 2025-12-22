import { ProtectedRoute } from "@/processes/routing/lib/ProtectedRoute";
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

        {/* 루트 경로 - 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};
