import { FilterPattern, createFilter } from "@rollup/pluginutils";

import * as csstree from "css-tree";
import { classPrefixer } from "./class-prefixer";
import { removeAtRule } from "./remove-at-rule";

const UNCHANGED = null;
interface Options {
  prefix: string;
  classExclude?: FilterPattern;
  fileExclude?: FilterPattern;
  fileInclude?: FilterPattern;
}

export function tailwindPrefixerCss(
  options: Options = { prefix: "tw-", classExclude: "" },
) {
  const {
    fileExclude,
    prefix,
    classExclude,
    fileInclude = "**/*.css",
  } = options;
  const fileFilter = createFilter(fileInclude, fileExclude);

  return {
    name: "rollup-plugin-tailwind-prefixer-css", // this name will show up in logs and errors
    transform(code, id) {
      if (!fileFilter(id)) {
        return UNCHANGED;
      }
      console.log({ id });
      const ast = csstree.parse(code);
      // classPrefixer(prefix, ast);
      const nast = removeAtRule(
        {
          mediaFeatureName: "prefers-color-scheme",
          mediaFeatureValue: "dark",
          prefixAsString: "html.darkmode",
        },
        classPrefixer(prefix, ast),
      );

      return {
        code: csstree.generate(nast),
      };
    },
  };
}
