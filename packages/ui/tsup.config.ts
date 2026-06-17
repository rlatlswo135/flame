import { packageBundleConfig } from "@flame/configs";
import { defineConfig } from "tsup";

export default defineConfig({
	...packageBundleConfig(),
	entry: ["core/index.ts"],
	banner: {
		js: "'use client'",
	},
});
