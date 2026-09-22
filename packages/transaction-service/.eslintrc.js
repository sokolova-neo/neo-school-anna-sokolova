module.exports = {
  extends: 'eslint-config-neo/config-backend',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json', './test/tsconfig.json', './migrations/tsconfig.json', './scripts/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-floating-promises': [
      'error',
      {
        ignoreIIFE: true,
      },
    ],
    // Import rules to prefer relative imports
    'import/no-relative-parent-imports': 'off', // Allow ../
    'import/prefer-default-export': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
};
