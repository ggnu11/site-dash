import { create } from "zustand";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/shared/api/firebase";
import { authAPI } from "@/shared/api/auth";
import { showError, showSuccess } from "@/shared/lib/toast";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
}

const mapUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || "",
  username:
    firebaseUser.displayName ||
    firebaseUser.email?.split("@")[0] ||
    "User",
});

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: mapUser(firebaseUser),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  signInWithGoogle: async () => {
    try {
      await authAPI.signInWithGoogle();
    } catch {
      showError("Google 로그인에 실패했습니다.");
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      set({ user: null, isAuthenticated: false });
      showSuccess("로그아웃되었습니다.");
    } catch {
      showError("로그아웃에 실패했습니다.");
    }
  },

  deleteAccount: async () => {
    try {
      await authAPI.deleteAccount();
      set({ user: null, isAuthenticated: false });
      showSuccess("회원탈퇴가 완료되었습니다.");
      return true;
    } catch {
      showError("회원탈퇴에 실패했습니다. 다시 로그인 후 시도해주세요.");
      return false;
    }
  },
}));
