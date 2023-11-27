# rollup-plugin-tailwind-prefixer

> [!WARNING]\
> Work in progress

## Getting started

In rollup or vite config:

```js
// rollup or vite config
import { tailwindPrefixerPlugin } from "rollup-plugin-tailwind-prefixer";

tailwindPrefixerPlugin( {
  prefix: "my-prefix-",
  js: {
    functionName: "tw",
    /**
     * This will allow the prefixer code to be treeshaked away.
     */
    postPrefixFunctionName: "",
  },
  /**
   * Options for altering CSS files
   */
  css: {
    /**
     * Replaces the media query for the :dark utility (`@media (prefers-color-scheme: dark)`)
     * with a custom css class
     *
     * Example:
     * @media (prefers-color-scheme: dark) { .dark\:.text-white: color: white }
     * becomes
     * .dark-mode .dark\:text-white  { color: white }
     *
     * @note: Should this plugin be its own plugin?
     */
    darkModeReplacement: ".dark-mode",
  },
} );
```

In your code:

```js
// tw.js
import { prefixer } from "rollup-plugin-tailwind-prefixer/prefixer";
export const tw = /*#__PURE__*/ prefixer.bind( undefined, "my-prefix-" );

// my-component.js
import { tw } from "./prefix.js";

const prefixedClasses = tw( "flex p-1 m-1 sm:hover:p-4" );

// After this file is built
const prefixedClasses =
  "my-prefix-flex my-prefix-p-1 my-prefix-m-1 my-prefix-sm:hover:p-4";
```
