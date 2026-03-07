module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  clearMocks: true,
  moduleNameMapper: {
    '^zod$': '<rootDir>/node_modules/zod/index.cjs'
  }
};
