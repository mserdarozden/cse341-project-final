// jest.config.js
require("dotenv").config({ path: ".env.test" });
module.exports = {
    preset: '@shelf/jest-mongodb',
    testEnvironment: 'node',
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    globalTeardown: './test/teardown.js', // Asegúrate de que esto esté presente
  };
  