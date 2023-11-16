import { describe, expect, test } from "vitest";
import { finder } from "./finder";

describe.skip("finder", () => {
  test("can find - simple 1", () => {
    const actual = finder("foo bar zoop", "bar", "zoop");
    expect(actual).toEqual([{ start: 4, end: 12, value: "bar zoop" }]);
  });

  test("can find - simple 2", () => {
    const actual = finder("foo bar bar zoop", "bar", "zoop");
    expect(actual).toEqual([
      {
        start: 4,
        end: 16,
        value: "bar bar zoop",
      },
    ]);
  });

  test("can handle missing end", () => {
    const actual = finder("foo bar foo zoop", "foo", "bar");
    expect(actual).toEqual([{ start: 0, end: 7, value: "foo bar" }]);
  });

  test("can find - multi 1", () => {
    const actual = finder("foo bar foo bar", "foo", "bar");
    expect(actual).toEqual([
      { start: 0, end: 7, value: "foo bar" },
      {
        start: 8,
        end: 15,
        value: "foo bar",
      },
    ]);
  });

  test("can find - multi 2", () => {
    const actual = finder("foo bar bar foo bar bar", "foo", "bar");
    expect(actual).toEqual([
      { start: 0, end: 7, value: "foo bar" },
      {
        start: 12,
        end: 19,
        value: "foo bar",
      },
    ]);
  });

  test("can find - class", () => {
    const actual = finder(`<h1 class="flex">`, ` class="`, `"`);
    expect(actual).toEqual([
      {
        start: 3,
        end: 16,
        value: ` class="flex"`,
      },
    ]);
  });

  test("can find - class and not data-class", () => {
    const actual = finder(
      `<h1 class="flex" data-class="a data">`,
      ` class="`,
      `"`
    );
    expect(actual).toHaveLength(1);
    expect(actual).toEqual([
      {
        start: 3,
        end: 16,
        value: ` class="flex"`,
      },
    ]);
  });

  test("can find matches in partial string", () => {
    const actual = finder(`<h1 class="flex `, ` absolute">`, `"`);
    expect(actual).toHaveLength(1);
    expect(actual).toEqual([
      {
        start: 3,
        end: 16,
        value: ` class="flex"`,
      },
    ]);
  });
});
