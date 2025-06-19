import React, { Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "@/processes/routing/lib/ProtectedRoute";
import { AppRoutes } from "@/processes/routing/model/routes";

// 동적 임포트를 사용한 페이지 컴포넌트 로딩
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SiteDash = lazy(() => import("@/SiteDash"));

// 로딩 컴포넌트
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen bg-[#1E1E1E]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
  </div>
);

/** 애플리케이션 라우터 컴포넌트 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
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
          <Route
            path={AppRoutes.ROOT}
            element={<Navigate to={AppRoutes.LOGIN} replace />}
          />

          {/* 일치하는 라우트 없을 경우 */}
          <Route path="*" element={<Navigate to={AppRoutes.LOGIN} replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
