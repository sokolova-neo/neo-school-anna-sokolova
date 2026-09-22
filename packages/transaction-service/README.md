# transaction-service

Service to process and store transactions

## Getting started

- Run `npm i` to install dependencies(if not installed)
- Before running ensure that dev-environment is running firsts

## Generate Types

- If you make any changes to the GraphQL schema you will need to regenerate the TypeScript GraphQL types. To do this run `npm run generate:types`. This is also run automatically on commit. To ignore minor typescript errors you can run `npm run generate:types:force` which will run the same as `npm run generate:types` but log typescript errors to the console instead of stopping.

- If you create new provider, producers, or repositories you will need to generate the inject tokens. To do this run `npm run build`. This is also run automatically on commit.

## Development

- Ensure all consumers/producers have the correct topic/queue names.
- Ensure all DI tokens are named correctly.
- Think of what order features must be built in to ensure there are no breaking changes.
- Run `npm start` before opening a PR to ensure every thing runs/starts up.

## Testing

- run `npm test` to test all files. Conversely you can pass in a test file name/path to test a specific file or folder

  - VALID `npm test example` `npm test test/unit` `npm test test/unit/example.test.ts`
  - INVALID `npm test example.ts` `npm test ./test/unit/example.test` `npm test packages/admin-portal/test/unit/example`

- To run tests in watch mode, where tests will automatically run on save run `npm run test:watch`

- To see code coverage run `npm run test:coverage`

### Troubleshooting

- If you are having typescript errors ensure you are using the workspace version(4.7.4)!

1. `cmd` + `shift` + `p` OR `ctrl` + `shift` + `p`
2. Start typing `Typescript: select typescript version...`
   If an option does not show up, open up any `tsconfig.json` file, and start from 1.

3. Select `Use Workspace Version`

- If you are getting an `AWS.SimpleQueueService.NonExistentQueue` error on starting of a service `cd ../dev-environment` and `npm run init`; This will create queues/topics from the cloud folder.
  If the issue persists ensure that the queue/topics are named correctly in cloud folder and config files!
