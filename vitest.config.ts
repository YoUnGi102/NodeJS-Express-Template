/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: [
            'test/**/*/test.ts',
            'test/unit/**/*.unit.test.ts',
            'test/integration/**/*.int.test.ts',
        ],
        setupFiles: [
            'test/setup-env.ts'
        ],
        globalSetup: './test/global-setup.ts',
    },
    plugins: [tsconfigPaths()],
});
