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
      logout: () => {
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
