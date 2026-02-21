import type { Options } from "tsup";

export const packageBundleConfig = (): Options => ({
  splitting: false,
  sourcemap: true,
  clean: true,
  format: "esm",
  dts: true,
});
