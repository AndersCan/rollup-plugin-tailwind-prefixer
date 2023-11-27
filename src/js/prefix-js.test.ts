import * as prettier from "prettier";
import { describe, expect, test } from "vitest";
import { prefixJs as realPrefixer } from "./prefix-js";

import { parse } from "acorn";
import * as estree from "estree";

const prefixed = ( code: string ) => {
  const ast = parse( code, {
    sourceType: "module",
    ecmaVersion: 2024,
  } );
  return realPrefixer(
    {
      prefix: "foo-",
      functionName: "tw",
      postPrefixFunctionName: "tw",
    },
    code,
    ast as estree.Node,
  )?.code;
};

const prefixedWithNoop = ( code: string ) => {
  const ast = parse( code, {
    sourceType: "module",
    ecmaVersion: 2024,
  } );
  return realPrefixer(
    {
      prefix: "foo-",
      functionName: "tw",
      postPrefixFunctionName: "",
    },
    code,
    ast as estree.Node,
  )?.code;
};
describe("prefixJs - prefixes", () => {
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

  test("can prefix simple string", async () => {
    const actual = prefixed( `tw("flex")` );

    await jsEqual( actual, `tw("foo-flex")` );
  });

  test("can prefix simple string", () => {
    const actual = prefixed( "html`<p class=\"${tw(\"flex\")}\"></p>`" );
    expect( actual ).toEqual( "html`<p class=\"${tw(\"foo-flex\")}\"></p>`" );
  });

  test("can prefix simple string - 2", () => {
    const actual = prefixed(
      "html`<pew-pew class=\"${tw(\"flex\")}\"\"></pew-pew>`",
    );
    expect( actual ).toEqual(
      "html`<pew-pew class=\"${tw(\"foo-flex\")}\"\"></pew-pew>`",
    );
  });

  test("does not prefix variables", () => {
    const actual = prefixed(
      "html`<pew-pew class=\"${tw(foo, bar)}\"\"></pew-pew>`",
    );
    expect( actual ).toEqual( undefined );
  });

  test("does not prefix variables, but constants", () => {
    const actual = prefixed(
      "html`<pew-pew class=\"${tw(`${foo} ${bar} buzz`)}\"></pew-pew>`",
    );
    expect( actual ).toEqual(
      "html`<pew-pew class=\"${tw(`${foo} ${bar} foo-buzz`)}\"></pew-pew>`",
    );
  });

  test("maintains correct whitespace with static variable static", () => {
    const actual = prefixed(
      "html`<pew-pew class=\"${tw(`static ${variable} static`)}\"></pew-pew>`",
    );
    expect( actual ).toEqual(
      "html`<pew-pew class=\"${tw(`foo-static ${variable} foo-static`)}\"></pew-pew>`",
    );
  });

  test("can prefix multi string", () => {
    const actual = prefixed(
      "html`<p class=\"${tw(\"flex flex-1 m-1\")}></p>`",
    );
    expect( actual ).toEqual(
      "html`<p class=\"${tw(\"foo-flex foo-flex-1 foo-m-1\")}></p>`",
    );
  });

  test("can prefix multi string - 2", () => {
    const actual = prefixed(
      "html`<pew-pew class=\"${tw(\"flex flex-1 m-1\")}\"></pew-pew>`",
    );
    expect( actual ).toEqual(
      "html`<pew-pew class=\"${tw(\"foo-flex foo-flex-1 foo-m-1\")}\"></pew-pew>`",
    );
  });

  test("can prefix utility classes", async () => {
    const actual = prefixed(
      "html`<p class=\"yxh${tw(\"sm:flex md:flex-1 hover:underline\")}\"></p>`",
    );
    await jsEqual(
      actual,
      "html`<p class=\"yxh${tw(\"sm:foo-flex md:foo-flex-1 hover:foo-underline\")}\"></p>`",
    );
  });

  test(`can prefix template literal variable with "`, () => {
    const actual = prefixed( "html`class=\"${tw(`${\"literal\"}`)}\"`" );
    expect( actual ).toEqual( "html`class=\"${tw(`${\"foo-literal\"}`)}\"`" );
  });

  test("only prefixes the first of multiple template variables not separated by a space", () => {
    const actual = prefixed( "html`class=\"${tw(\"${bar}${bar}\")}\"`" );
    expect( actual ).toEqual( "html`class=\"${tw(\"foo-${bar}${bar}\")}\"`" );
  });

  test("edge case: can prefix a string that contains a template variable (is a string)", () => {
    const actual = prefixed( "html`class=\"${tw(\"${bar}\")}\"`" );
    expect( actual ).toEqual( "html`class=\"${tw(\"foo-${bar}\")}\"`" );
  });

  test("does not prefix template variables -- impossible to know what they represent", () => {
    const actual = prefixed( "html`class=\"${tw(`${bar} ${bar}`)}\"`" );
    expect( actual ).toEqual( undefined );
  });

  test("prefixes all template variables separated by many spaces -- multiple spaces are removed", () => {
    const actual = prefixed(
      "html`<p class=\"${tw(\"  ${bar}     ${bar}  \")}\"></p>`",
    );
    expect( actual ).toEqual(
      "html`<p class=\"${tw(\" foo-${bar} foo-${bar} \")}\"></p>`",
    );
  });

  test("prefixes tailwind utility classes correctly", () => {
    const actual = prefixed(
      "html` class=\"${tw(\"dark:hover:focus:flex\")}\"`",
    );
    expect( actual ).toEqual(
      "html` class=\"${tw(\"dark:hover:focus:foo-flex\")}\"`",
    );
  });
});

describe("prefixJs - can remove function call", () => {
  test("can prefix simple string", async () => {
    const actual = prefixedWithNoop( `tw("flex")` );

    await jsEqual( actual, `("foo-flex")` );
  });

  test("can prefix simple string with spaces", async () => {
    const actual = prefixedWithNoop( `tw ( " flex " ) ` );

    await jsEqual( actual, `(" foo-flex ")` );
  });

  test("skips variable", async () => {
    const actual = prefixedWithNoop( `tw(bar)` );

    await jsEqual( actual, `bar` );
  });

  test.todo(
    "prints warning when a variable (Identifier) are passed directly",
    async () => {},
  );
});

async function jsEqual( a: string = "", b: string ) {
  const [ prettyA, prettyB ] = await Promise.all( [
    prettier.format( a, { filepath: "a.js" } ),
    prettier.format( b, { filepath: "b.js" } ),
  ] );

  expect( prettyA ).toEqual( prettyB );
}
