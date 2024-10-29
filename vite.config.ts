import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default defineConfig({
  plugins: [react(), dts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "src/App.tsx",
      name: "CustomTable",
      formats: ["es", "umd"],
      fileName: (format) => `custom-table.${format}.js`,
    },
    rollupOptions: {
      plugins: [peerDepsExternal(), resolve(), commonjs()],
      // Include dependencies in the bundle
      external: [], // Leave this empty to include all dependencies
    },
  },
});
