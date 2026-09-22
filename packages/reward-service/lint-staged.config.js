module.exports = {
  'src/application/api/schema/**/*.{ts,js}': [
    () => 'npm run generate:types',
    'npm run format',
    'git add packages/reward-service/lib/schema.graphql packages/reward-service/lib/federated-schema.graphql packages/reward-service/src/application/api/types/schema.d.ts',
  ],
  'src/application/consumers/**/*.ts': [() => 'npm run scan:consumers', 'git add packages/reward-service/codegen'],
  '*.{ts,js}': ['eslint --fix --max-warnings 18'],
  '*.{ts,js,json,graphql,gql,yaml,yml,md}': ['prettier --write'],
  'test/**/*.ts': [
    // Using the function syntax so this ends up using the same tsconfig for the project instead of bypassing it. Ref: https://github.com/okonet/lint-staged/issues/825#issuecomment-731160104
    () => './node_modules/.bin/tsc -p test/tsconfig.json',
  ],
  'scripts/**/*.ts': [() => './node_modules/.bin/tsc -p scripts/tsconfig.json'],
  // Run npm install when package.json changes
  'package.json': [() => 'npm i', 'git add package-lock.json'],
};
