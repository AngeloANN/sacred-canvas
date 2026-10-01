import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: { port: 8080 },
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router"] },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    // Use src/server.ts as the server entry (SSR error wrapper)
    tanstackStart({ server: { entry: "server" } }),
    // Builds the deployable server. Nitro auto-detects Vercel/Netlify/etc. when deployed there.
    command === "build" && nitro(),
    viteReact(),
  ],
}));
