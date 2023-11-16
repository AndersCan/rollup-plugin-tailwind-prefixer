import "./css.fixture.css";

function html( str: any, ...args: any[] ) {
  console.log( str );
}

function prefixer( ...srt: string[] ) {
  console.log( srt );
  return srt;
}

prefixer( "one", "two", `three`, `${"four"}` );

html`<h1> Hello, world</h1>`;
html`<h1 class="flex flex-1 unrelated-non-tailwind-class">abc</h1>`;
html`<h1 class="hover:flex "> a b c </h1>`;
html`<h1 class="sm:focus:hover:flex ">  a  b  c  </h1>`;

html`<h1 class=" ${" TEMPLATE_1 "} ${" TEMPLATE_2 "} " >  a  b  c  </h1>`;
html`<h2 class=" absolute ${`TEMPLATE_3`} flex" ></h2>`;
html`<h2 class=" absolute ${1 + 2} flex" ></h2>`;
html`<h2 
class=" absolute flex" >
multiline
</h2>`;
