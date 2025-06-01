import { defineConfig } from 'tsup';
import { builtinModules } from 'module';

console.log(JSON.stringify(builtinModules));

export default defineConfig({
  entry: ['src'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: true,
  banner: {
    js: `import "reflect-metadata";`,
  },
  external: ['dotenv', 'fs', 'path'],
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
