export { tailwindClassPrefixer } from "./common/tailwind-class-prefixer";
export { tailwindPrefixerPlugin } from "./tailwind-prefixer-plugin";

import { tailwindClassPrefixer } from "./common/tailwind-class-prefixer";

/**
 * For cases where you are using classe
 */
export function createPrefixer( prefix: string ) {
  /** */
  const tw = ( twClasses: string ) => {
    return tailwindClassPrefixer( prefix, twClasses );
  };

  /**
   * Plugin will swap to this function for reducing bundle size
   */
  tw.noop = ( twClasses: string ) => {
    return twClasses;
  };

  return tw;
}
