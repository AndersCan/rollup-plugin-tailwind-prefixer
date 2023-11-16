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
                const fnName = node.expression.callee.name;
                console.log( "fn name", fnName );

                if ( fnName === "prefixer" ) {
                  console.log( "args", node.expression.arguments );
                }
              }
            }
          }

          if ( node.type === "Literal" ) {
            // console.log( "literal", node.value );
          }
          if ( node.type === "TaggedTemplateExpression" ) {
            console.log( "ENTERING", node.tag );
          }

          if ( node.type === "TemplateLiteral" ) {
            // console.log( "TemplateLiteral", node.quasis );
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
