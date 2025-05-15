import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  // Set base to "/csv-formatter/" for GitHub Pages.
  base: "/csv-formatter/",
});
