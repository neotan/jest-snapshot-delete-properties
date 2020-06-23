// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // A set of global variables that need to be available in all test environments
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  },

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ["./src/setupTests.ts"],

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  snapshotSerializers: ["enzyme-to-json/serializer"],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/*.spec.+(ts|tsx|js)"
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
