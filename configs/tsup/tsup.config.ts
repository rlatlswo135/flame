import type { Options } from 'tsup';

export const packageBundleConfig = (): Options => ({
  splitting: false,
  sourcemap: false,
  clean: true,
  format: 'esm',
  dts: true,
});
