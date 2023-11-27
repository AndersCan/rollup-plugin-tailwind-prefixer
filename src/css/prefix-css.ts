import * as csstree from "css-tree";
import { classPrefixer } from "./class-prefixer";
import { replaceAtRule } from "./replace-at-rule";

interface Props {
  /**
   * CSS prefix for all classes
   */
  prefix: string;
  /**
   * Optional. The selector replacement for for the `:dark` media query
   * @default false
   */
  darkModeReplacement: false | string;
}
export function prefixCss( props: Props, code: string ) {
  const ast = csstree.parse( code );
  const prefixedAst = classPrefixer( props.prefix, ast );

  const darkModeReplaced = props.darkModeReplacement
    ? replaceDarkMode( props.darkModeReplacement, prefixedAst )
    : prefixedAst;

  return {
    code: csstree.generate( darkModeReplaced ),
  };
}

function replaceDarkMode( replace: string, ast: csstree.CssNode ) {
  return replaceAtRule(
    {
      mediaFeatureName: "prefers-color-scheme",
      mediaFeatureValue: "dark",
      replaceSelector: replace,
    },
    ast,
  );
}
