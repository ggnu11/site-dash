import { useAuthStore } from "@/entities/auth/model/auth.store";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/** 보호된 라우트 컴포넌트 속성 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/** 인증 상태에 따라 라우트를 보호하는 컴포넌트 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔒 [ProtectedRoute] Checking authentication...", { isAuthenticated, hasUser: !!user });
    
    // 토큰이 있는지 확인하고 로컬 스토리지에서 사용자 정보 복원
    const token = localStorage.getItem("auth-token");
    const authStorage = localStorage.getItem("auth-storage");

    console.log("🔒 [ProtectedRoute] Storage check:", { hasToken: !!token, hasAuthStorage: !!authStorage });

    // 인증 상태가 이미 true이면 바로 통과
    if (isAuthenticated && user) {
      console.log("✅ [ProtectedRoute] Already authenticated, allowing access");
      setIsLoading(false);
      return;
    }

    if (token && authStorage) {
      try {
        const parsedAuth = JSON.parse(authStorage);
        console.log("🔒 [ProtectedRoute] Parsed auth storage:", { 
          hasState: !!parsedAuth.state,
          hasUser: !!parsedAuth.state?.user,
          isAuthenticated: parsedAuth.state?.isAuthenticated 
        });
        
        if (
          parsedAuth.state &&
          parsedAuth.state.user &&
          parsedAuth.state.isAuthenticated
        ) {
          // Zustand의 persist 미들웨어가 자동으로 상태를 복원합니다
          // 상태가 복원되었는지 확인하기 위해 약간의 지연
          setTimeout(() => {
            console.log("✅ [ProtectedRoute] Auth state restored, allowing access");
            setIsLoading(false);
          }, 200);
          return;
        }
      } catch (error) {
        console.error("❌ [ProtectedRoute] Failed to parse auth storage:", error);
        // 손상된 데이터 정리
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-storage");
      }
    }

    // 인증 정보가 없거나 손상된 경우
    if (!token || !authStorage) {
      console.warn("⚠️ [ProtectedRoute] No auth token or storage found, redirecting to login");
    } else if (!isAuthenticated) {
      console.warn("⚠️ [ProtectedRoute] Not authenticated, redirecting to login");
    }

    setIsLoading(false);
  }, [isAuthenticated, user]);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  /**
   * 인증되지 않은 경우 로그인 페이지로 리다이렉트
   * 인증된 경우 요청된 컴포넌트 렌더링
   */
  if (!isAuthenticated) {
    console.log("🚫 [ProtectedRoute] Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ [ProtectedRoute] Authenticated, rendering protected content");
  return <>{children}</>;
};
