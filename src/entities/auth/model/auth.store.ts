import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authAPI } from "@/shared/api/auth";

/** 사용자 인증 상태 인터페이스 */
interface User {
  id: string;
  email: string;
  username: string;
}

/** 인증 스토어 타입 */
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<boolean>;
  setGoogleAuth: (token: string, user: User) => void;
  deleteAccount: () => Promise<boolean>;
}

/** 인증 상태 관리 Zustand 스토어 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      /** 로그인 메서드 */
      login: async (email, password) => {
        try {
          const response = await authAPI.login({ email, password });

          // 토큰을 별도로 저장
          localStorage.setItem("auth-token", response.token);

          const user = {
            id: response.user.id,
            email: response.user.email,
            username: response.user.username,
          };

          set({
            user,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },

      /** 로그아웃 메서드 */
      logout: async () => {
        try {
          // 서버에 로그아웃 요청
          await authAPI.logout();
        } catch (error) {
          console.error("Logout API error:", error);
          // API 실패해도 로컬 상태는 정리
        }

        try {
          localStorage.removeItem("auth-token");
          localStorage.removeItem("auth-storage");
        } catch (error) {
          console.error("Failed to clear auth state", error);
        }

        set({ user: null, isAuthenticated: false });
      },

      /** 회원가입 메서드 */
      register: async (email, password, username) => {
        try {
          const response = await authAPI.register({
            email,
            password,
            username,
          });

          // 토큰을 별도로 저장
          localStorage.setItem("auth-token", response.token);

          const user = {
            id: response.user.id,
            email: response.user.email,
            username: response.user.username,
          };

          set({
            user,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error("Register failed:", error);
          return false;
        }
      },

      /** Google 로그인 콜백 처리 */
      setGoogleAuth: (token, user) => {
        try {
          console.log("🔐 [AuthStore] Setting Google auth:", {
            userId: user.id,
            email: user.email,
          });

          // 토큰 저장
          localStorage.setItem("auth-token", token);
          console.log("💾 [AuthStore] Token saved to localStorage");

          // 상태 업데이트
          set({
            user,
            isAuthenticated: true,
          });
          console.log("✅ [AuthStore] Auth state updated:", {
            user,
            isAuthenticated: true,
          });

          // persist 미들웨어가 localStorage에 저장하는 것을 확인
          setTimeout(() => {
            const savedAuth = localStorage.getItem("auth-storage");
            if (savedAuth) {
              console.log(
                "✅ [AuthStore] Auth state persisted to localStorage"
              );
            } else {
              console.warn(
                "⚠️ [AuthStore] Auth state not persisted to localStorage"
              );
            }
          }, 100);
        } catch (error) {
          console.error("❌ [AuthStore] Failed to set Google auth:", error);
          throw error;
        }
      },

      /** 회원탈퇴 메서드 */
      deleteAccount: async () => {
        try {
          // 서버에 회원탈퇴 요청
          await authAPI.deleteAccount();

          // 로컬 스토리지 정리
          try {
            localStorage.removeItem("auth-token");
            localStorage.removeItem("auth-storage");
          } catch (error) {
            console.error("Failed to clear auth state", error);
          }

          // 상태 초기화
          set({ user: null, isAuthenticated: false });

          return true;
        } catch (error) {
          console.error("Delete account failed:", error);
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지 키
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
