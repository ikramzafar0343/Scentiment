import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        visualizer({
            open: false,
            gzipSize: true,
            brotliSize: true,
            filename: 'stats.html'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-framer': ['framer-motion'],
                }
            }
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/test/setup.ts'],
        include: ['src/**/*.test.{ts,tsx}']
    }
});
