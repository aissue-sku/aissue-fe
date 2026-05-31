import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.API_PROXY_TARGET || "http://192.0.0.2:8080";

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.svg",
          "icon.svg",
          "icon-192.png",
          "icon-512.png",
        ],
        manifest: {
          name: "AIssue",
          short_name: "AIssue",
          description: "AI 기반 뉴스 신뢰도 분석 서비스",
          theme_color: "#51A2FF",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          scope: "/",
          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    server: {
      host: true,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: { "*": "" },
          headers: { origin: "http://localhost:5173" },
        },
        "/content": {
          target,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: { "*": "" },
          headers: { origin: "http://localhost:5173" },
        },
        "/user": {
          target,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: { "*": "" },
          headers: { origin: "http://localhost:5173" },
        },
      },
    },
  };
});
