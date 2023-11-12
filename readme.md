# rollup-plugin-tailwind-prefixer

> WIP :danger:

Prefixes _all_ html class definitions with a prefix.

Currently only works with tag template (`TemplateElement`)

```ts
import { tailwindPrefixer } from "rollup-plugin-tailwind-prefixer";
tailwindPrefixer( {
  prefix: "fuzz-",
  include: "./**/*.ts",
  exclude: "./excluded/**/*.ts",
} ),
```

Ex:

```ts
const a = html`<h1> Hello, world</h1>`;
const b = html`<h1 class="flex flex-1 unrelated-non-tailwind-class"></h1>`;
const c = html`<h1 class="hover:flex"></h1>`;
const d = html`<h1 class="sm:focus:hover:flex"></h1>`;

// Classes with template literals does not work (yet?)
const e = html`<h1 class=" ${" TEMPLATE_1 "} ${" TEMPLATE_2 "} " ></h1>`;
const f = html`<h2 class=" absolute ${`TEMPLATE_3`} flex" ></h2>`;

// becomes

const a = html`<h1> Hello, world</h1>`;
const b =
  html`<h1 class="fuzz-flex fuzz-flex-1 fuzz-unrelated-non-tailwind-class"></h1>`;
const c = html`<h1 class="hover:fuzz-flex"></h1>`;
const d = html`<h1 class="sm:focus:hover:fuzz-flex"></h1>`;

// Classes with template literals does not work (yet?)
const e = html`<h1 class=" ${" TEMPLATE_1 "} ${" TEMPLATE_2 "} " ></h1>`;
const f = html`<h2 class=" absolute ${`TEMPLATE_3`} flex" ></h2>`;
```
