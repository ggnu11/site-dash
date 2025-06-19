import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        if (email === "test@example.com" && password === "password1234") {
          set({
            user: {
              id: "1",
              email,
              username: "TestUser",
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      /** 로그아웃 메서드 */
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      /** 회원가입 메서드 (현재는 목 데이터 기반) */
      register: async (email, username) => {
        // TODO: 실제 백엔드 연동 전 임시 로직
        set({
          user: {
            id: Date.now().toString(),
            email,
            username,
          },
          isAuthenticated: true,
        });
        return true;
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지 키
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
