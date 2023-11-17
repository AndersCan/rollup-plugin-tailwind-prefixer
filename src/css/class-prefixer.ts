import * as csstree from "css-tree";
import { tailwindClassPrefixer } from "../common/tailwind-class-prefixer";

export function classPrefixer( prefix: string, css: string | csstree.CssNode ) {
  const ast = typeof css === "string" ? csstree.parse( css ) : css;

  csstree.walk( ast, ( node ) => {
    if ( node.type === "ClassSelector" ) {
      node.name = tailwindClassPrefixer( prefix, node.name );
    }
  } );

  return ast;
}
