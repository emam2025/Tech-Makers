/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['node_modules/(?!(@testing-library)/)'],
  setupFiles: [],
};
