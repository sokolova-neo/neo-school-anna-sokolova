module.exports = {
  ignorePatterns: ['*.generated.d.ts', '*.generated.ts', 'config'],
  plugins: ['@neofinancial/web-linting'],
  extends: ['plugin:@neofinancial/web-linting/next', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { peerDependencies: true, devDependencies: true },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@neofinancial/morpheus-components/lib/*'],
            message:
              "Path imports from '@neofinancial/morpheus-components' are disallowed. Please use the root import from '@neofinancial/morpheus-components' instead.",
          },
          {
            group: ['@neofinancial/morpheus-icons/lib/*'],
            message:
              "Path imports from '@neofinancial/morpheus-icons' are disallowed. Please use the root import from '@neofinancial/morpheus-icons' instead.",
          },
          {
            group: ['@neofinancial/morpheus-illustrations/lib/*'],
            message:
              "Path imports from '@neofinancial/morpheus-illustrations' are disallowed. Please use the root import from '@neofinancial/morpheus-illustrations' instead.",
          },
          {
            group: [
              '**/../types/__graphql/types.generated.d',
              '**/../types/__graphql/types.generated',
            ],
            message: 'Please create domain type to use instead.',
          },
        ],
      },
    ],
    'import/extensions': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': 'off',
    'react/function-component-declaration': 'off',
    'react/function-component-definition': 'off',
    'import/no-default-export': 'off',
    'prefer-arrow-callback': 'off',
    'react/style-prop-object': 'off',
  },
};
