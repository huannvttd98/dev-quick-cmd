import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./src/manifest";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: [/chrome-extension:\/\//],
    },
    hmr: {
      port: 5173,
    },
  },
  build: {
    rollupOptions: {
      input: {
        offscreen: "src/offscreen/clipboard.html",
        sidepanel: "src/sidepanel/index.html",
      },
    },
  },
});
