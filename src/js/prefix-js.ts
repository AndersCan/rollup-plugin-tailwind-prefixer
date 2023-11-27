import MagicString from "magic-string";

import { Node } from "estree";
import { walk } from "estree-walker";
import { tailwindClassPrefixer } from "../common/tailwind-class-prefixer";

const UNCHANGED = null;

export interface PrefixJsOption {
  /**
   * Prefix
   */
  prefix: string;
  /**
   * Function name to prefix
   */
  functionName: string;

  /**
   * After prefixing, change function name.
   * In almost all cases, should be set to empty string
   */
  postPrefixFunctionName: string;
}

/**
 * Prefix all words with the given prefix
 */
export function prefixJs( options: PrefixJsOption, code: string, ast: Node ) {
  const ms = new MagicString( code );

  let inPrefixMode = false;
  walk( ast, {
    enter: ( node ) => {
      // @ts-expect-error
      const nodeStart = node.start;
      // @ts-expect-error
      const nodeEnd = node.end;
      if ( node.type === "CallExpression" ) {
        if ( node.callee.type === "Identifier" ) {
          if ( node.callee.name === options.functionName ) {
            inPrefixMode = true;
            if ( options.postPrefixFunctionName !== undefined ) {
              const fnStart = nodeStart;
              const fnEnd = nodeStart + options.functionName.length;
              ms.update( fnStart, fnEnd, options.postPrefixFunctionName );
            }
          }
        }
      }

      if ( !inPrefixMode ) return;
      if ( node.type == "TemplateElement" && node.value && node.value.raw ) {
        ms.update(
          nodeStart,
          nodeEnd,
          `${tailwindClassPrefixer( options.prefix, node.value.raw )}`,
        );
      }
      if ( node.type === "Literal" && node.value ) {
        ms.update(
          nodeStart,
          nodeEnd,
          `"${tailwindClassPrefixer( options.prefix, node.value as string )}"`,
        );
      }
    },
    leave: ( node ) => {
      if ( node.type === "CallExpression" ) {
        if ( node.callee.type === "Identifier" ) {
          if ( node.callee.name === options.functionName ) {
            inPrefixMode = false;
          }
        }
      }
    },
  } );

  if ( !ms.hasChanged() ) return UNCHANGED;

  return {
    code: ms.toString(),
  };
}
