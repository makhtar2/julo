import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        // Tests purement logiques : environnement node par défaut (pas de jsdom, pas de conflit ESM)
        environment: 'node',
        // Les tests de composants (rendu React) ont besoin du DOM
        environmentMatchGlobs: [['components/**', 'jsdom']],
        setupFiles: ['./vitest.setup.js'],
        globals: true,
        include: ['lib/**/*.test.{js,ts}', 'components/**/*.test.{js,jsx,tsx}'],
        exclude: ['node_modules/**'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
