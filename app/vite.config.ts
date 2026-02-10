import { defineConfig } from 'vite'; // Change from 'vitest/config' to 'vite'
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});