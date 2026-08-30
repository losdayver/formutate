import { defineConfig } from "vite";
import path from "node:path";

const dirname = import.meta.dirname;

export default defineConfig({
  root: path.resolve(dirname, "src", "dev"),
  build: {
    outDir: path.resolve(dirname, "dist", "dev"),
    sourcemap: "inline",
    minify: false,
  },
});
