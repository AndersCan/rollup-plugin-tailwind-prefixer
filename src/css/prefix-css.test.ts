import * as csstree from "css-tree";
import * as prettier from "prettier";
import { describe, expect, test } from "vitest";
import { prefixCss } from "./prefix-css";

describe("prefixCss", () => {
  test("plugin can just prefix", async () => {
    const expected = `
    @media (prefers-color-scheme: dark) {
      .my-prefix-foo {display: none;}
    }`;
    const actual = prefixCss(
      {
        prefix: "my-prefix-",
        darkModeReplacement: false,
      },
      `
    @media (prefers-color-scheme: dark) {
      .foo {display: none;}
    }`,
    ).code;
    await cssEqual( actual, expected );
  });

  test("plugin prefixes in the expected order -> prefix then dark mode replacement", async () => {
    const expected = `
    .my-dark-mode .my-prefix-foo {
      display: none;
    }`;
    const actual = prefixCss(
      {
        prefix: "my-prefix-",
        darkModeReplacement: ".my-dark-mode",
      },
      `
    @media (prefers-color-scheme: dark) {
      .foo {display: none;}
    }`,
    ).code;
    await cssEqual( actual, expected );
  });
});

async function cssEqual( aa: string | csstree.CssNode, b: string ) {
  const a = typeof aa === "string" ? aa : csstree.generate( aa );
  const [ prettyA, prettyB ] = await Promise.all( [
    prettier.format( a, { filepath: "a.css" } ),
    prettier.format( b, { filepath: "b.css" } ),
  ] );

  expect( prettyA ).toEqual( prettyB );
}
