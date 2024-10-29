import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import dts from "vite-plugin-dts";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
// import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "src/toolkit-table.tsx",
      name: "ToolkitTable",
      formats: ["es", "umd"],
      fileName: (format) => `toolkit-table.${format}.js`,
    },
    rollupOptions: {
      plugins: [
        // peerDepsExternal(),
        resolve(),
        commonjs(),
        postcss({
          extract: true,
          minimize: true,
          modules: true,
        }),
      ],
      // Include dependencies in the bundle
      external: [], // Leave this empty to include all dependencies
    },
  },
});
