import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/products": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/customers": "http://localhost:3000",
      "/orders": "http://localhost:3000",
      "/orders/:id": "http://localhost:3000",
      "/brands": "http://localhost:3000",
      "/categories": "http://localhost:3000",
    },
  },
});
