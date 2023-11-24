// vite.config.ts
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig( {
  build: {
    minify: false,
    outDir: "dist",
    rollupOptions: {
      // Skip all Node built-ins
      external: ( id ) => {
        if ( id.includes( "estree-walker" ) ) {
          return false;
        }
        return /^[^./\0]/.test( id );
      },
    },
    lib: {
      entry: {
        index: path.resolve( process.cwd(), "./src/index.ts" ),
        "create-prefixer": path.resolve(
          process.cwd(),
          "./src/create-prefixer.ts",
        ),
      },
      formats: [ "es", "cjs" ],
    },
  },
  plugins: [
    // tailwindPrefixerCss({
    //   prefix: "my-prefix-",
    //   classExclude: "darkmode",
    // }),
    // tailwindPrefixer( {
    //   prefix: "fuzz-",
    //   include: "./tests/**/*.fixture.ts",
    // } ),
    dts( {
      exclude: [ "./**/*.test.ts", "./**/*.bench.ts" ],
    } ),
  ],
} );

const root = path.resolve( process.cwd(), "./src/dev" );
