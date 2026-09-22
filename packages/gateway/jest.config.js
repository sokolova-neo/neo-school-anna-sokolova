module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js}',
    '!<rootDir>/src/server.ts',
    '!<rootDir>/src/types/**/*',
    '!<rootDir>/node_modules/',
    '!<rootDir>/build/',
    '!<rootDir>/*.js',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/config.*.js'],
};
