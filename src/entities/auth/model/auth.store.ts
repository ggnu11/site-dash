import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  logout: () => void;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<boolean>;
}

/** 인증 상태 관리 Zustand 스토어 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      /** 로그인 메서드 (현재는 목 데이터 기반) */
      login: async (email, password) => {
        // TODO: 실제 백엔드 연동 전 임시 로직
        if (
          (email === "test@example.com" && password === "password1234") ||
          (email === "admin" && password === "ipageon")
        ) {
          const user = {
            id: "1",
            email,
            username:
              email === "admin" || email === "test@example.com"
                ? "AdminUser"
                : "TestUser",
          };

          // 세션 스토리지에도 저장하여 GitHub Pages 호환성 개선
          try {
            sessionStorage.setItem("auth-user", JSON.stringify(user));
            sessionStorage.setItem("auth-status", "true");
          } catch (error) {
            console.error("Failed to save auth state", error);
          }

          set({
            user,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      /** 로그아웃 메서드 */
      logout: () => {
        try {
          sessionStorage.removeItem("auth-user");
          sessionStorage.removeItem("auth-status");
        } catch (error) {
          console.error("Failed to clear auth state", error);
        }

        set({ user: null, isAuthenticated: false });
      },

      /** 회원가입 메서드 (현재는 목 데이터 기반) */
      register: async (email, username) => {
        // TODO: 실제 백엔드 연동 전 임시 로직
        const user = {
          id: Date.now().toString(),
          email,
          username,
        };

        try {
          sessionStorage.setItem("auth-user", JSON.stringify(user));
          sessionStorage.setItem("auth-status", "true");
        } catch (error) {
          console.error("Failed to save auth state", error);
        }

        set({
          user,
          isAuthenticated: true,
        });
        return true;
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
