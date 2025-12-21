import { AppRouter } from "@/processes/routing/ui/AppRouter";
import { useMenuStore } from "@/entities/menu/model/menu.store";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useEffect, useState } from "react";

function App() {
  const fetchMenus = useMenuStore((state) => state.fetchMenus);
  const { isAuthenticated, user } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 앱 초기화 시 인증 상태 확인
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth-token");
      const authStorage = localStorage.getItem("auth-storage");

      if (token && authStorage) {
        try {
          const parsedAuth = JSON.parse(authStorage);
          if (parsedAuth.state?.isAuthenticated && parsedAuth.state?.user) {
            // Zustand persist가 자동으로 상태를 복원했는지 확인
            console.log("Auth state restored from localStorage");
          }
        } catch (error) {
          console.error("Failed to restore auth state:", error);
          // 손상된 데이터 정리
          localStorage.removeItem("auth-token");
          localStorage.removeItem("auth-storage");
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // 인증된 상태에서만 메뉴 데이터 로드
    if (isAuthenticated && isInitialized) {
      fetchMenus();
    }
  }, [isAuthenticated, isInitialized, fetchMenus]);

  // 초기화 완료 전까지 로딩 표시
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Initializing...</div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
