// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Site URL - update this when you have a custom domain
  site: 'https://clintonsenaye.com',

  // Output static files (default for Astro)
  output: 'static',

  // Build configuration
  build: {
    // Generate clean URLs without .html extension
    format: 'directory',
  },

  // Enable markdown features
  markdown: {
    // Syntax highlighting for code blocks
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  // Vite configuration
  vite: {
    build: {
      // Improve CSS handling
      cssMinify: true,
    },
  },
});
