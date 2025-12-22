import axios from "axios";

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
      // 로그아웃 API 호출 중에는 인터셉터가 다시 트리거되지 않도록 체크
      const isLogoutRequest = error.config?.url?.includes("/auth/logout");
      const isDeleteAccountRequest =
        error.config?.url?.includes("/auth/account");

      // 로그아웃이나 회원탈퇴 요청 중에는 무시 (이미 처리 중)
      if (isLogoutRequest || isDeleteAccountRequest) {
        return Promise.reject(error);
      }

      // 토큰이 만료되었거나 유효하지 않은 경우
      console.warn(
        "⚠️ [API Client] 401 Unauthorized - Clearing auth and redirecting to login"
      );

      // 인증 상태 초기화 (로그아웃 API 호출 없이 직접 정리)
      try {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-storage");
        // Zustand persist가 자동으로 상태를 동기화하므로 리다이렉트만 수행
      } catch (err) {
        console.error("Failed to clear auth state:", err);
      }

      // HashRouter를 사용하므로 #/login으로 리다이렉트
      const basePath = window.location.pathname;
      window.location.href = `${basePath}#/login`;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
