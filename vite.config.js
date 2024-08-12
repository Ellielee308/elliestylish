import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        product: "./index.html",
        homepage: "./homepage.html",
      },
    },
    outDir: "dist", // 指定構建輸出目錄
  },
});
