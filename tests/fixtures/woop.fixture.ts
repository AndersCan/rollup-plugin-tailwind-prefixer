function html( str: any, ...args: any[] ) {
}

const a = html`<h1> Hello, world</h1>`;
const b = html`<h1 class="flex flex-1 unrelated-non-tailwind-class">abc</h1>`;
const c = html`<h1 class="hover:flex "> a b c </h1>`;
const d = html`<h1 class="sm:focus:hover:flex ">  a  b  c  </h1>`;
const e =
  html`<h1 class=" ${" TEMPLATE_1 "} ${" TEMPLATE_2 "} " >  a  b  c  </h1>`;
const f = html`<h2 class=" absolute ${`TEMPLATE_3`} flex" ></h2>`;
console.log( a, b, c, d, e, f );
