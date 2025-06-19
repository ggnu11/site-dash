/** 애플리케이션 라우트 정의 */
export const AppRoutes = {
  /** 로그인 페이지 */
  LOGIN: "/login",

  /** 대시보드 페이지 */
  DASHBOARD: "/dashboard",

  /** 루트 페이지 */
  ROOT: "/",
} as const;

/** 라우트 타입 */
export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
