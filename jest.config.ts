import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
};

export default config;