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
     * This will allow the tw function to be treeshaked away.
     */
    postPrefixFunctionName: "tw.noop",
  },
  css: {
    /**
     * Extra: should probably be moved to another repo...
     *
     * Replaces the media query for :dark (`@media (prefers-color-scheme: dark)`)
     * with a custom css class
     *
     * @media (prefers-color-scheme: dark) { .dark\:.text-white: color: white }
     * becomes
     * .dark-mode .dark\:text-white  { color: white }
     */
    darkModeReplacement: ".dark-mode",
  },
} );
```

In your code:

```js
// prefix.js
import { prefixer } from "rollup-plugin-tailwind-prefixer/prefixer";
export const tw = prefixer.bind( undefined, "my-prefix-" );

// my-component.js
import { tw } from "./prefix.js";

const prefixedClasses = tw( "flex p-1 m-1 sm:hover:p-4" );

// After this file is built
const prefixedClasses = tw.noop(
  "my-prefix-flex my-prefix-p-1 my-prefix-m-1 my-prefix-sm:hover:p-4",
);
```
