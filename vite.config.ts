import react from "@vitejs/plugin-react";
import { defineConfig, type ViteDevServer } from "vite";
import { fastify } from "./api/index.ts";

async function configureServer(server: ViteDevServer) {
  await fastify.ready();
  server.middlewares.use((req, res, next) => {
    if (!req.originalUrl?.startsWith("/api")) {
      return next();
    }
    fastify.server.emit("request", req, res);
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer,
    },
  ],
});
