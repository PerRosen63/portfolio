import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Log the NODE_ENV variable
console.log("NODE_ENV:", process.env.NODE_ENV);

const base = process.env.NODE_ENV === "production" ? "/portfolio/" : "/";
console.log("Base URL:", base);

export default defineConfig({
  base,
  plugins: [vue()],
  optimizeDeps: {
    include: ["cross-fetch"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
  },
});
