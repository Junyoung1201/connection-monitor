import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: './',
    build: {
        outDir: './build'
    },
    server: {
        port: 3001,
        open: false
    }
});