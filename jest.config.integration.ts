import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: "./",
	testMatch: ["**/test/**/*.int.test.ts"],
	setupFiles: ["<rootDir>/test/setup-env.ts"],
	setupFilesAfterEnv: ["<rootDir>/test/integration/setup.ts"],
	globalSetup: "./test/global-setup.ts",
	globalTeardown: "./test/global-teardown.ts",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/",
	}),
	transform: {
		"^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
	},
};

export default config;
