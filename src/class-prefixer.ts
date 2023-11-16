import * as csstree from "css-tree";

export function classPrefixer(prefix: string, css: string | csstree.CssNode) {
  const ast = typeof css === "string" ? csstree.parse(css) : css;

  csstree.walk(ast, (node) => {
    if (node.type === "ClassSelector") {
      node.name = `${prefix}${node.name}`;
    }
  });

  // return csstree.generate(ast);
  return ast;
}
