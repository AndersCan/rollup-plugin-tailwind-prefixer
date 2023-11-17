import * as prettier from "prettier";
import { describe, expect, test } from "vitest";
import { prefixer as realPrefixer } from "./old-class-prefixer";

import { parse } from "acorn";
import * as estree from "estree";

const prefixed = ( code: string ) => {
  const ast = parse( code, {
    sourceType: "module",
    ecmaVersion: 2024,
  } );
  return realPrefixer( "foo-", code, ast as estree.Node )?.code;
};
describe.skip("prefixer", () => {
  test("empty string returns null", () => {
    const expected = undefined;
    const actual = prefixed( "" );
    expect( actual ).toEqual( expected );
  });

  test("multi space string returns empty string", () => {
    const expected = undefined;
    const actual = prefixed( "   " );
    expect( actual ).toEqual( expected );
  });

  test.only("can prefix simple string", async () => {
    const actual = prefixed( `html\`<p class="outer">
    \${html\`<p class="inner"></p>\`}</p>\`` );
    // expect(actual).toEqual(`html\`<p class="foo-flex"></p>\``);

    await jsEqual( actual, `html\`<p class="foo-flex"></p>\`` );
  });
  // test.only("can prefix simple string", () => {
  //   const actual = prefixed(`html\`<p class="flex"></p>\``);
  //   expect(actual).toEqual(`html\`<p class="foo-flex"></p>\``);
  // });

  test("can prefix simple string - 2", () => {
    const actual = prefixed( `html\`<pew-pew class="flex"></pew-pew>\`` );
    expect( actual ).toEqual( `html\`<pew-pew class="foo-flex"></pew-pew>\`` );
  });

  test("can prefix multi string", () => {
    const actual = prefixed( `html\`<p class="flex flex-1 m-1"></p>\`` );
    expect( actual ).toEqual(
      `html\`<p class="foo-flex foo-flex-1 foo-m-1"></p>\``,
    );
  });

  test("can prefix multi string - 2", () => {
    const actual = prefixed(
      `html\`<pew-pew class="flex flex-1 m-1"></pew-pew>\``,
    );
    expect( actual ).toEqual(
      `html\`<pew-pew class="foo-flex foo-flex-1 foo-m-1"></pew-pew>\``,
    );
  });

  test("can prefix utility classes", () => {
    const actual = prefixed(
      `html\`<p class="sm:flex md:flex-1 hover:underline"></p>\``,
    );
    expect( actual ).toEqual(
      `html\`<p class="sm:foo-flex md:foo-flex-1 hover:foo-underline"></p>\``,
    );
  });

  // test("can prefix utility classes", () => {
  //   const actual = prefixed("sm:hover:flex md:hover:flex-1 hover:sm:underline");
  //   expect(actual).toEqual(
  //     "sm:hover:foo-flex md:hover:foo-flex-1 hover:sm:foo-underline",
  //   );
  // });

  test("can prefix template variables", () => {
    const actual = prefixed( `html\`class="\${bar}"\`` );
    expect( actual ).toEqual( `html\`class="foo-\${bar}"\`` );
  });

  test(`can prefix template literal variable with "`, () => {
    const actual = prefixed( `html\`class="\${"literal"}"\`` );
    expect( actual ).toEqual( `html\`class="foo-\${"literal"}"\`` );
  });

  test("only prefixes the first of multiple template variables not separated by a space", () => {
    const actual = prefixed( `html\`class="\${bar}\${bar}"\`` );
    expect( actual ).toEqual( `html\`class="foo-\${bar}\${bar}"\`` );
  });

  test("prefixes all template variables separated by spaces", () => {
    const actual = prefixed( `html\`class="\${bar} \${bar}"\`` );
    expect( actual ).toEqual( `html\`class="foo-\${bar} foo-\${bar}"\`` );
  });

  test("prefixes all template variables separated by many spaces", () => {
    const actual = prefixed( `html\`class="  \${bar}     \${bar}  "\`` );
    expect( actual ).toEqual(
      `html\`class="  foo-\${bar}     foo-\${bar}  "\``,
    );
  });

  test("prefixes tailwind utility classes correctly", () => {
    const actual = prefixed( `html\` class="dark:hover:focus:flex"\`` );
    expect( actual ).toEqual( `html\` class="dark:hover:focus:foo-flex"\`` );
  });
});

async function jsEqual( a: string = "", b: string ) {
  const [ prettyA, prettyB ] = await Promise.all( [
    prettier.format( a, { filepath: "a.js" } ),
    prettier.format( b, { filepath: "b.js" } ),
  ] );

  expect( prettyA ).toEqual( prettyB );
}
