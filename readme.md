# rollup-plugin-tailwind-prefixer

## Motivation

This plugin _re-imagines_ how the config options to tailwind affect the final result.

Pros:

1. Write plain tailwind, but get the prefixes (mostly) for free.
2. Avoids the css selector `is()` (when you need to support older browsers)
3. Bonus: Ability to replace the `@media (prefers-color-scheme: dark)` with another css-selector.

Cons:

1. Not needed if your end-users already support the `is()` selector
2. Some boilerplate to setup the `tw(...)` function
3. My first rollup-plugin (code has unit tests)

> [!TIP]
> Checkout the [demo](https://stackblitz.com/edit/vitejs-vite-ozmt7k?file=src%2Fmain.ts) to see it in action

## Setup

Add the plugin to your rollup or vite config

```js
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
import { tw } from "./tw.js";

const prefixedClasses = tw( "flex p-1 m-1 sm:hover:p-4" );

// After the plugin in run...
const prefixedClasses =
  "my-prefix-flex my-prefix-p-1 my-prefix-m-1 my-prefix-sm:hover:p-4";
```

## How it works

Your JS code is parsed for function names equal to `config.functionName`. When found, the function arguments are prefixed. (variables are skipped as we do not know what they contain)

Your css files are also prefixed, but _all_ css classes are prefixed. Use the `include`/`exclude` options to control which files get prefixed
