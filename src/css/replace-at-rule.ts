import * as csstree from "css-tree";

interface Props {
  mediaFeatureName: string;
  mediaFeatureValue: string;
  replaceSelector: string;
}

/**
 * Replaces the `@media (prefers-color-scheme: dark) {}` with a css class as prefix
 */
export function replaceAtRule( props: Props, css: string | csstree.CssNode ) {
  const ast = typeof css === "string" ? csstree.parse( css ) : css;
  let rootScope: csstree.StyleSheet | undefined = undefined;
  let currentChildren: csstree.List<csstree.CssNode> | undefined = undefined;
  let lastBlocks: csstree.Block[] = [];
  let atRuleCounter = 0;

  // Handle darkmode
  csstree.walk( ast, {
    enter: ( node: csstree.CssNode ) => {
      // @ts-expect-error
      if ( node.children ) {
        // @ts-expect-error
        currentChildren = node.children;
      }

      if ( node.type === "Block" ) {
        lastBlocks.push( node );
      }

      if ( node.type === "StyleSheet" ) {
        rootScope = node;
      }
      if ( node.type === "Atrule" ) {
        /* c8 ignore next 4 */
        if ( !node.block ) {
          console.warn( "empty at rule (no block) -- might be an error" );
          return;
        }
        atRuleCounter++;
        const currentBlock = node.block;
        const parentBlock: csstree.Block | undefined =
          lastBlocks[lastBlocks.length - 1];
        const currentBlockChildren = node.block.children;

        if ( node.prelude?.type === "AtrulePrelude" && currentBlockChildren ) {
          outerLoop:
          for ( const n of node.prelude.children ) {
            if ( n.type === "MediaQueryList" ) {
              for ( const nn of n.children ) {
                if ( nn.type === "MediaQuery" ) {
                  for ( const nnn of nn.children ) {
                    if ( nnn.type === "MediaFeature" ) {
                      if ( nnn.name === props.mediaFeatureName ) {
                        if (
                          nnn.value?.type === "Identifier"
                          && nnn.value.name === props.mediaFeatureValue
                        ) {
                          if ( !parentBlock ) {
                            /* c8 ignore next 5 */
                            if ( !rootScope ) {
                              throw new Error(
                                "rootScope should be the first thing defined",
                              );
                            }
                            const modified = currentBlock.children.map(
                              ( el ) => {
                                return selectorPrefix(
                                  props.replaceSelector,
                                  el,
                                );
                              },
                            );
                            rootScope.children = rootScope.children.filter(
                              ( el ) => {
                                const match = el !== node;
                                return match;
                              },
                            );
                            rootScope.children.appendList( modified );

                            return;
                          }
                          // 1. From Parent Block - remove this node from children
                          // 2. Add Children from currentBlock to parentBlock
                          parentBlock.children = parentBlock.children.filter(
                            ( el ) => {
                              return el !== node;
                            },
                          );

                          parentBlock.children.appendList(
                            currentBlock.children.map( ( el ) => {
                              return selectorPrefix(
                                props.replaceSelector,
                                el,
                              );
                            } ),
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
    },
    leave: ( node: csstree.CssNode ) => {
      if ( node.type === "Atrule" ) {
        atRuleCounter--;
      }
      if ( node.type === "Block" ) {
        lastBlocks.pop();
      }
    },
  } );

  return ast;
}

function selectorPrefix( prefix: string, ast: csstree.CssNode ) {
  const prefixAst = csstree.parse( prefix );
  csstree.walk( ast, ( node ) => {
    if ( node.type === "Selector" ) {
      node.children.prependData(
        csstree.fromPlainObject( {
          type: "Combinator",
          name: " ",
        } ),
      );
      node.children.prependData( prefixAst );
    }
  } );

  return ast;
}
