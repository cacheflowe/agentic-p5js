import { defineConfig } from "vite";

export default defineConfig({
  // Use relative paths in the build, so the site works from a subfolder
  // like https://cacheflowe.github.io/agentic-p5js/ (GitHub Pages).
  base: "./",
  build: {
    // p5.js itself is about 1.2 MB, which is expected, so don't warn about it
    chunkSizeWarningLimit: 1500,
  },
});
