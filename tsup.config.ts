import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: true,
  esbuildOptions(options) {
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
