import { ProtectedRoute } from "@/processes/routing/lib/ProtectedRoute";
import { AppRoutes } from "@/processes/routing/model/routes";
import React from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

// 페이지 컴포넌트 임포트
import LoginPage from "@/pages/LoginPage";
import SiteDash from "@/SiteDash";

/** 애플리케이션 라우터 컴포넌트 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />

        {/* 대시보드 (보호된 라우트) */}
        <Route
          path={AppRoutes.DASHBOARD}
          element={
            <ProtectedRoute>
              <SiteDash />
            </ProtectedRoute>
          }
        />

        {/* 루트 경로 처리 */}
        <Route path={AppRoutes.ROOT} element={<SiteDash />} />

        {/* 일치하는 라우트 없을 경우 */}
        <Route path="*" element={<SiteDash />} />
      </Routes>
    </Router>
  );
};
