import MagicString from "magic-string";

// import * as x from "@rollup/pluginutils";

import { Node } from "estree";
import { walk } from "estree-walker";
import { tailwindClassPrefixer } from "../common/tailwind-class-prefixer";
import { finder } from "./finder";

const UNCHANGED = null;
/**
 * Prefix all words with the given prefix
 */
export function prefixer( prefix: string, code: string, ast: Node ) {
  const ms = new MagicString( code );
  // console.log(JSON.stringify(ast, null, 2));
  // const ast = this.parse(code);
  walk( ast, {
    enter: ( node, parent, prop, index ) => {
      if ( node.type === "FunctionDeclaration" ) {
        // console.log( "FunctionDeclaration", node.type,node.id );
      }

      if ( node.type === "ExpressionStatement" ) {
        if ( node.expression.type === "CallExpression" ) {
          if ( node.expression.callee.type === "Identifier" ) {
            const fnName = node.expression.callee.name;
            // console.log("fn name", fnName);

            if ( fnName === "prefixer" ) {
              // console.log("args", node.expression.arguments);
            }
          }
        }
      }

      if ( node.type === "Literal" ) {
        // console.log("literal", node.value);
      }

      if ( node.type === "TemplateElement" ) {
        // console.log({ code });
        // @ts-expect-error
        const nodeStart: number = node.start;
        // @ts-expect-error
        const nodeEnd: number = node.end;
        const searchString = "" + code.substring( nodeStart, nodeEnd );
        // console.log( { searchString, node: node.value.raw } );
        const matches = finder( searchString, ` class="`, `"` );
        // console.log({ matches, searchString });

        let prefixCount = 0;
        matches.forEach( ( match ) => {
          const cssClass = match.value.slice( ` class="`.length, -1 );

          const prefixed = tailwindClassPrefixer( prefix, cssClass );

          const realStart = nodeStart + match.start;
          const realEnd = nodeEnd - ` class="`.length;

          const replace = ` class="${prefixed}"`;
          const pre = ms.slice( 0, realStart );
          const post = ms.slice( realEnd, realEnd + 1 );
          const realSlice = ms.slice( realStart, realEnd );
          console.log( { realStart, realEnd, pre, realSlice, post } );

          ms.update( realStart, realEnd, replace );
          prefixCount++;
        } );
      }

      if ( node.type === "TaggedTemplateExpression" ) {
        console.log( "ENTERING", node.tag );

        if ( node.tag.type === "Identifier" ) {
          if ( node.tag.name === "html" ) {
            node.quasi.expressions.map( ( el ) => {
              // @ts-expect-error
              const { start, end } = el;
              const previousChar = code.charAt( start - "${ ".length );
              if ( previousChar === " " || previousChar === `"` ) {
                // ms.appendLeft(start - 2, prefix);
              }
            } );
            // \${bar};
          }
        }
      }

      if ( node.type === "TemplateLiteral" ) {
        // console.log("TemplateLiteral", node.quasis);
      }
    },
    leave: ( node ) => {
      if ( node.type === "TaggedTemplateExpression" ) {
        console.log( "LEAVING", node.tag );
        console.log();
      }
    },
  } );

  if ( !ms.hasChanged() ) return UNCHANGED;

  return {
    code: ms.toString(),
  };
}
