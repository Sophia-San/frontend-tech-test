import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 💡 Add the css configuration block here
  css: {
    preprocessorOptions: {
      scss: {
        // Configure the Sass compiler to suppress warnings
        logger: {
          warn: (message, options) => {
            // Check if span and url exist and the url is a file path
            if (options.span && options.span.url) {
              // 💡 FIX: Convert the URL object to a string before using string methods
              const url = options.span.url.toString();

              // Check if the path points into the node_modules directory
              if (url.includes("node_modules")) {
                // Suppress warnings from node_modules
                return;
              }
            }
            // Log all other warnings
            console.warn(message);
          },
        },
      },
    },
  },
});
