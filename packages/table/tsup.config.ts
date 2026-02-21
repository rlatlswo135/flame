import { defineConfig } from "tsup";
import { packageBundleConfig } from "@flame/configs";

export default defineConfig({
  ...packageBundleConfig(),
  entry: ["src/index.ts"],
});
