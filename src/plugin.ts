import { createFilter } from "@rollup/pluginutils";

import { walk } from "estree-walker";
import MagicString from "magic-string";

import { finder } from "./finder";
import { prefixer } from "./prefixer";

const UNCHANGED = null;
interface Options {
  prefix: string;
  exclude?: string;
  include?: string;
}
export function tailwindPrefixer( options: Options = { prefix: "" } ) {
  const { exclude, prefix, include = "**/*.{js,ts}" } = options;
  const filter = createFilter( include, exclude );

  return {
    name: "rollup-plugin-tailwind-prefixer", // this name will show up in logs and errors
    transform( code, id ) {
      if ( !filter( id ) ) {
        return UNCHANGED;
      }

      const ms = new MagicString( code );

      const parsed = this.parse( code );
      walk( parsed, {
        enter: ( node ) => {
          if ( node.type === "TaggedTemplateExpression" ) {
            // console.log( "ENTERING", node.tag );
          }

          if ( node.type === "TemplateLiteral" ) {
            // console.log( "TemplateLiteral", node.quasis );
          }

          if ( node.type === "TemplateElement" ) {
            // @ts-expect-error
            const nodeStart: number = node.start;
            // @ts-expect-error
            const nodeEnd: number = node.end;
            const searchString = "" + code.substring( nodeStart, nodeEnd );
            // console.log( { searchString, node: node.value.raw } );
            const matches = finder( searchString, ` class="`, `"` );

            matches.forEach( match => {
              const cssClass = match.value.slice( ` class="`.length, -1 );

              const prefixed = prefixer( prefix, cssClass );

              const realStart = nodeStart + match.start;
              const realEnd = realStart + match.end - 3;

              const replace = ` class="${prefixed}"`;

              ms.update( realStart, realEnd, replace );
            } );
          }
        },
        leave: ( node ) => {
          if ( node.type === "TaggedTemplateExpression" ) {
            // console.log( "LEAVING", node.tag );
          }
        },
      } );

      if ( !ms.hasChanged ) return UNCHANGED;

      return {
        code: ms.toString(),
      };
    },
  };
}
