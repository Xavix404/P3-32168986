import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend =
    env.BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3000";

  return defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
      outDir: "frontend/dist",
    },
    server: {
      proxy: {
        "/api": {
          target: backend,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
