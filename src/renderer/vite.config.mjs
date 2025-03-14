import path from "path";
import vuePlugin from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import AutoImport from 'unplugin-auto-import/vite';
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

/**
 * https://vitejs.dev/config
 */
export default defineConfig({
  root: path.join(__dirname),
  publicDir: "public",
  server: {
    port: 8080,
  },
  open: false,
  base: "/",
  build: {
    cssCodeSplit: false,
    // outDir 的位置与 src/tsconfig.json 中的 outDir 息息相关
    outDir: path.join(__dirname, "../../build/renderer"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, './index.html'),
        nested: path.resolve(__dirname, './worker.html'),
      }
    }
  },
  resolve: {
    alias: {
      "@views": path.join(__dirname, "views"),
      "@lib": path.join(__dirname, "../lib"),
      "@file-download": path.join(__dirname, "../lib/file-download"),
      "@utils": path.join(__dirname, "../lib/utils"),
      "@": path.join(__dirname, "./"),
    },
  },
  plugins: [
    vuePlugin(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
  ],
});
