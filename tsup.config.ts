import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: true,

  // Ensure reflect-metadata is bundled correctly
  noExternal: ['reflect-metadata'],

  // Prevent bundling Node.js built-ins and dotenv (which uses dynamic require)
  external: ['fs', 'path', 'dotenv'],

  esbuildOptions(options) {
    // Ensure reflect-metadata is injected at the top
    options.banner = {
      js: 'import "reflect-metadata";',
    };

    // Automatically append .js extension to relative imports in ESM output
    options.plugins = [
      {
        name: 'add-js-extension',
        setup(build) {
          build.onResolve({ filter: /^\.+\// }, (args) => {
            if (!args.path.endsWith('.js') && !args.path.endsWith('.ts')) {
              return {
                path: args.path + '.js',
                namespace: 'file',
              };
            }
          });
        },
      },
    ];
  },
});
