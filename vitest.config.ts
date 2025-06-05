/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: [
            'test/unit/**/*.unit.test.ts',
            'test/**/*.int.test.ts',
        ],
        setupFiles: [
            'test/setup-env.ts'
        ],
        globalSetup: './test/global-setup.ts',
    },
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@config': path.resolve(__dirname, 'src/config'),
            '@logic': path.resolve(__dirname, 'src/logic'),
            '@model': path.resolve(__dirname, 'src/logic/model'),
            '@utils': path.resolve(__dirname, 'src/logic/shared/utils'),
            '@database': path.resolve(__dirname, 'src/database'),
            '@shared': path.resolve(__dirname, 'src/logic/shared'),
            '@test': path.resolve(__dirname, 'test'),
        }
    }
});
