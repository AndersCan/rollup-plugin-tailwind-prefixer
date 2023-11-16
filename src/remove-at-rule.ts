import * as csstree from "css-tree";

interface Props {
  mediaFeatureName: string;
  mediaFeatureValue: string;
  prefixAsString: string;
}

/**
 * Can remove `@media (prefers-color-scheme: dark) {}` and prefix content
 */
export function removeAtRule(props: Props, css: string | csstree.CssNode) {
  const ast = typeof css === "string" ? csstree.parse(css) : css;
  let firstChildren: csstree.List<csstree.CssNode> | undefined = undefined;
  // Handle darkmode
  csstree.walk(ast, {
    enter: (node: csstree.CssNode) => {
      if (node.type === "StyleSheet") {
        firstChildren = node.children;
      }
      if (node.type === "Atrule") {
        const currentBlockChildren = node.block?.children;

        if (node.prelude?.type === "AtrulePrelude" && currentBlockChildren) {
          outerLoop: for (const n of node.prelude.children) {
            if (n.type === "MediaQueryList") {
              for (const nn of n.children) {
                if (nn.type === "MediaQuery") {
                  for (const nnn of nn.children) {
                    if (nnn.type === "MediaFeature") {
                      if (nnn.name === props.mediaFeatureName) {
                        if (
                          nnn.value?.type === "Identifier" &&
                          nnn.value.name === props.mediaFeatureValue
                        ) {
                          if (!firstChildren) {
                            throw new Error(
                              "firstChildren is missing -- should not happen",
                            );
                          }
                          const notThis = firstChildren.filter((el) => {
                            return el !== node;
                          });

                          firstChildren.clear();

                          firstChildren.appendList(notThis);

                          firstChildren.appendList(
                            currentBlockChildren.map((el) => {
                              return selectorPrefix(props.prefixAsString, el);
                            }),
                          );
                        }
                        break outerLoop;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // //@ts-expect-error
      // if (node.children) {
      //   //@ts-expect-error
      //   firstChildren = node.children;
      // }
    },
  });

  // return csstree.generate(ast);
  return ast;
}

function selectorPrefix(prefix: string, ast: csstree.CssNode) {
  const prefixAst = csstree.parse(prefix);
  csstree.walk(ast, (node) => {
    if (node.type === "Selector") {
      node.children = node.children.prependData(
        csstree.fromPlainObject({
          type: "Combinator",
          name: " ",
        }),
      );
      node.children = node.children.prependData(prefixAst);
    }
  });

  return ast;
}
