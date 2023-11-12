// vite.config.ts
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { tailwindPrefixer } from "./src/plugin";
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig( {
  build: {
    minify: false,
    outDir: "dist",
    rollupOptions: {
      // Skip all Node built-ins
      external: ( id ) => {
        return /^[^./\0]/.test( id );
      },
    },
    lib: {
      entry: {
        index: path.resolve( process.cwd(), "./src/index.ts" ),
        fixture: path.resolve(
          process.cwd(),
          "./tests/fixtures/woop.fixture.ts",
        ),
      },
      formats: [ "es", "cjs" ],
    },
  },
  plugins: [
    tailwindPrefixer( {
      prefix: "fuzz-",
      include: "./tests/**/*.fixture.ts",
    } ),
    dts( {
      exclude: [ "./**/*.test.ts", "./**/*.bench.ts" ],
    } ),
  ],
} );

const root = path.resolve( process.cwd(), "./src/dev" );
