import { describe, expect, test } from "vitest";
import * as prettier from "prettier";
import { classPrefixer } from "#src/class-prefixer";
import * as csstree from "css-tree";

describe("classPrefixer", () => {
  test("can change simple css class", async () => {
    const expected = `.prefix-flex { display:flex }`;
    const actual = classPrefixer("prefix-", `.flex { display:flex }`);
    await cssEqual(actual, expected);
  });

  test("can change multi css class", async () => {
    const code = ".foo .bar { display: flex }";
    const expected = `.prefix-foo .prefix-bar { display:flex }`;
    const actual = classPrefixer("prefix-", `${code}`);
    await cssEqual(actual, expected);
  });

  test("can change multi css class", async () => {
    const code = ".foo.bar {display: flex}";
    const expected = `.prefix-foo.prefix-bar { display:flex }`;
    const actual = classPrefixer("prefix-", `${code}`);
    await cssEqual(actual, expected);
  });
});

async function cssEqual(aa: string | csstree.CssNode, b: string) {
  const a = typeof aa === "string" ? aa : csstree.generate(aa);
  const [prettyA, prettyB] = await Promise.all([
    prettier.format(a, { filepath: "a.css" }),
    prettier.format(b, { filepath: "b.css" }),
  ]);

  expect(prettyA).toEqual(prettyB);
}
