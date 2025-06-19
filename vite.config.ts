import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: "/site-dash/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 라이브러리와 노드 모듈 분리
          if (id.includes("node_modules")) {
            return "vendor";
          }

          // 주요 기능별 청크 분리
          if (id.includes("src/pages/")) {
            return "pages";
          }

          if (id.includes("src/features/")) {
            return "features";
          }

          if (id.includes("src/entities/")) {
            return "entities";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 한도 조정 (KB)
    sourcemap: false, // 프로덕션에서 소스맵 비활성화
    minify: "terser", // 더 효율적인 압축을 위해 terser 사용
    terserOptions: {
      compress: {
        drop_console: true, // 콘솔 로그 제거
        drop_debugger: true, // 디버거 문 제거
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "framer-motion",
    ],
  },
});
