import { createFilter } from "@rollup/pluginutils";

import { Node } from "estree";
import { prefixCss } from "./css/css";
import { prefixJs, PrefixJsOption } from "./js/prefix-js";

const UNCHANGED = null;

interface JSOptions extends Omit<PrefixJsOption, "prefix"> {
  include?: string;
  exclude?: string;
}
interface Options {
  /**
   * Prefix - will be added to JS and **all** css classes
   */
  prefix: string;
  css?: {
    include?: string;
    exclude?: string;
    /**
     * Replace the Media query for darkmode with a css selector
     */
    darkModeReplacement?: false | string;
  };
  js: JSOptions;
}
export function tailwindPrefixerPlugin( options: Options ) {
  const { prefix, css = {}, js } = options;
  const jsFilter = createFilter(
    js.include || "**/*.{js,mjs,jsx,ts,mts,tsx}",
    js.exclude,
  );
  const cssFilter = createFilter( css.include || "**/*.css", css.exclude );

  const prefixJsOptions: PrefixJsOption = {
    prefix,
    ...js,
  };

  return {
    // this name will show up in logs and errors
    name: "rollup-plugin-tailwind-prefixer",
    transform( code: string, id: string ) {
      if ( jsFilter( id ) ) {
        // @ts-expect-error
        const ast: Node = this.parse( code );
        return prefixJs( prefixJsOptions, code, ast );
      }

      if ( cssFilter( id ) ) {
        return prefixCss(
          { prefix, darkModeReplacement: css.darkModeReplacement || false },
          code,
        );
      }

      return UNCHANGED;
    },
  };
}

tailwindPrefixerPlugin( {
  prefix: "my-prefix-",
  js: {
    functionName: "tw",
  },
} );

tailwindPrefixerPlugin( {
  prefix: "my-prefix-",
  js: {
    functionName: "tw",
    postPrefixFunctionName: "tw.noop",
  },
  css: {
    darkModeReplacement: ".dark-mode",
  },
} );
