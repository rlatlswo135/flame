import { vitestReactConfig } from "@flame/configs";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(vitestReactConfig, defineConfig({ test: {} }));
