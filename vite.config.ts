import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.API_PROXY_TARGET || "http://192.0.0.2:8080";

  return {
    plugins: [react(), tailwindcss()],
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
