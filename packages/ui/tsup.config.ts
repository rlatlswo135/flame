import { packageBundleConfig } from "@flame/configs";
import { defineConfig } from "tsup";

export default defineConfig({
  ...packageBundleConfig(),
  entry: ["src/index.ts"],
});
