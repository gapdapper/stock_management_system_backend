/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        useESM: false,
      },
    ],
  },

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
};