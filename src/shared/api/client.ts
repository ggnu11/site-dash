import axios from "axios";
import { useAuthStore } from "@/entities/auth/model/auth.store";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 인증 오류 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      console.warn(
        "⚠️ [API Client] 401 Unauthorized - Clearing auth and redirecting to login"
      );

      // 인증 상태 초기화
      const { logout } = useAuthStore.getState();
      logout().catch(() => {
        // 로그아웃 실패해도 로컬 스토리지는 정리
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-storage");
      });

      // HashRouter를 사용하므로 #/login으로 리다이렉트
      const basePath = window.location.pathname;
      window.location.href = `${basePath}#/login`;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
