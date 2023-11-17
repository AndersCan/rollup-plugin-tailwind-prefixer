import * as csstree from "css-tree";
import { classPrefixer } from "./class-prefixer";
import { removeAtRule } from "./remove-at-rule";

interface Props {
  prefix: string;
  /**
   * Should DarkMode be replaced by another CSS selector
   */
  darkModeReplacement: false | string;
}
export function prefixCss( props: Props, code: string ) {
  const ast = csstree.parse( code );
  const prefixedAst = classPrefixer( props.prefix, ast );
  const nast = props.darkModeReplacement
    ? removeAtRule(
      {
        mediaFeatureName: "prefers-color-scheme",
        mediaFeatureValue: "dark",
        prefixAsString: props.darkModeReplacement,
      },
      prefixedAst,
    )
    : prefixedAst;

  return {
    code: csstree.generate( nast ),
  };
}
