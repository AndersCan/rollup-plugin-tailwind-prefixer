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

      const ast = this.parse( code );
      walk( ast, {
        enter: ( node, parent, prop, index ) => {
          if ( node.type === "FunctionDeclaration" ) {
            // console.log( "FunctionDeclaration", node.type,node.id );
          }

          if ( node.type === "ExpressionStatement" ) {
            if ( node.expression.type === "CallExpression" ) {
              if ( node.expression.callee.type === "Identifier" ) {
                // console.log( "fn name", node.expression.callee.name );
              }
            }
          }

          if ( node.type === "Literal" ) {
            console.log( "literal", node.value );
          }
          if ( node.type === "TaggedTemplateExpression" ) {
            console.log( "ENTERING", node.tag );
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
              console.log( replace );
              ms.update( realStart, realEnd, replace );
            } );
          }
        },
        leave: ( node ) => {
          if ( node.type === "TaggedTemplateExpression" ) {
            console.log( "LEAVING", node.tag );
            console.log();
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
