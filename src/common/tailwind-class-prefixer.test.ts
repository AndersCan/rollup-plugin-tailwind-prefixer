import { describe, expect, test } from "vitest";
import { tailwindClassPrefixer } from "./tailwind-class-prefixer";

const prefixed = tailwindClassPrefixer.bind( this, "foo-" );
describe("prefixer", () => {
  test("empty string return empty string", () => {
    const input = "";
    const actual = prefixed( input );
    expect( actual ).toEqual( input );
  });

  test("multi space string returns empty string", () => {
    const input = "   ";
    const actual = prefixed( input );
    expect( actual ).toEqual( " " );
  });

  test("can prefix simple string", () => {
    const actual = prefixed( "flex" );
    expect( actual ).toEqual( "foo-flex" );
  });
  test("can prefix multi string", () => {
    const actual = prefixed( "flex flex-1 m-1" );
    expect( actual ).toEqual( "foo-flex foo-flex-1 foo-m-1" );
  });

  test("can prefix utility classes", () => {
    const actual = prefixed( "sm:flex md:flex-1 hover:underline" );
    expect( actual ).toEqual( "sm:foo-flex md:foo-flex-1 hover:foo-underline" );
  });

  test("can prefix utility classes", () => {
    const actual = prefixed(
      "sm:hover:flex md:hover:flex-1 hover:sm:underline",
    );
    expect( actual ).toEqual(
      "sm:hover:foo-flex md:hover:foo-flex-1 hover:sm:foo-underline",
    );
  });

  test("can prefix template variables", () => {
    const actual = prefixed( "${bar}" );
    expect( actual ).toEqual( "foo-${bar}" );
  });

  test(`can prefix template literal variable with "`, () => {
    const actual = prefixed( `${"literal"}` );
    expect( actual ).toEqual( `foo-${"literal"}` );
  });

  test("can prefix multiple template variables", () => {
    const actual = prefixed( "${bar}${bar}" );
    expect( actual ).toEqual( "foo-${bar}${bar}" );
  });

  test("can prefix multiple template variables (with many spaces)", () => {
    const actual = prefixed( "  ${bar}    ${bar}    " );
    expect( actual ).toEqual( " foo-${bar} foo-${bar}" );
  });

  // test("can prefix multiple template variables (with many spaces)", () => {
  //   const actual = (`class="one md:one" class="two md:two" class="three md:three"`);
  //   const woop = actual.split(/class="([a-zA-Z0-9_ -:]+)"/);
  //   expect( woop ).toEqual( [] );
  // });
});
