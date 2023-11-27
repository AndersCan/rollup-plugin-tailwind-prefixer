import * as csstree from "css-tree";
import * as prettier from "prettier";
import { describe, expect, test } from "vitest";
import { replaceAtRule } from "./replace-at-rule";

describe("replaceAtRule", () => {
  test("can change simple css class", async () => {
    const expected = `.foo {display: none;}`;
    const actual = replaceAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        replaceSelector: "",
      },
      `
    @media (prefers-color-scheme: dark) {
      .foo {display: none;}
    }`,
    );
    await cssEqual( actual, expected );
  });

  test("can change multi css class", async () => {
    const expected = `
    html.darkmode .foo {display: none;} 
    html.darkmode .bar {display: flex;}
    `;
    const actual = replaceAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        replaceSelector: "html.darkmode",
      },
      `
    @media (prefers-color-scheme: dark) {
      .foo {display: none;}
      .bar {display: flex;}
    }`,
    );
    await cssEqual( actual, expected );
  });

  test("can change multi MediaQuery class", async () => {
    const expected = `
      @media (pointer: coarse) {
        @media (min-width: 720px) {
          html.darkmode .dark\:touch\:md\:p-96 {
            padding: 24rem;
          }
        }
      }
    `;
    // "prefers-color-scheme"
    const actual = replaceAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        replaceSelector: "html.darkmode",
      },
      `
      @media (prefers-color-scheme: dark) {
        @media (pointer: coarse) {
          @media (min-width: 720px) {
            .dark\:touch\:md\:p-96 {
              padding: 24rem;
            }
          }
        }
      }
      `,
    );
    await cssEqual( actual, expected );
  });

  test("can change multi MediaQuery class when nested", async () => {
    const expected = `
      @media (pointer: coarse) {
        @media (min-width: 720px) {
          html.darkmode .dark\:touch\:md\:p-96 {
            padding: 24rem;
          }
        }
      }
    `;

    const actual = replaceAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        replaceSelector: "html.darkmode",
      },
      `
      @media (pointer: coarse) {
        @media (prefers-color-scheme: dark) {
          @media (min-width: 720px) {
            .dark\:touch\:md\:p-96 {
              padding: 24rem;
            }
          }
        }
      }
      `,
    );
    await cssEqual( actual, expected );
  });

  test("can change multi MediaQuery class when not directly nested", async () => {
    const expected = `
      @media (pointer: coarse) {
        .foo { display: flex }
        .bar { display: flex }
        @media (min-width: 720px) {
          html.darkmode .dark\:touch\:md\:p-96 {
            padding: 24rem;
          }
        }
      }
    `;

    const actual = replaceAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        replaceSelector: "html.darkmode",
      },
      `
      @media (pointer: coarse) {
        .foo { display: flex }
        @media (prefers-color-scheme: dark) {
          @media (min-width: 720px) {
            .dark\:touch\:md\:p-96 {
              padding: 24rem;
            }
          }
        }
        .bar { display: flex }
      }
      `,
    );
    await cssEqual( actual, expected );
  });

  test("non-nested MediaQuery is added to global scope (firstChildren)", async () => {
    const expected = `
    .group:hover .group-hover\:underline {
      text-decoration-line: underline;
    }
    html.darkmode .dark\:border-core-blue-900 {
      --tw-border-opacity: 1;
      border-color: rgb(10 35 67 / var(--tw-border-opacity));
    }
    `;

    const actual = replaceAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        replaceSelector: "html.darkmode",
      },
      `
      .group:hover .group-hover\:underline {
        text-decoration-line: underline;
      }
      @media (prefers-color-scheme: dark) {
        .dark\:border-core-blue-900 {
          --tw-border-opacity: 1;
          border-color: rgb(10 35 67 / var(--tw-border-opacity));
        }
      }
      `,
    );
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
