# admin-portal

Admin portal to view and edit user details and transaction details.

## Getting started

- Run `npm i` to install dependencies(if not installed)
- Before running ensure that all back-end service's as well as the gateway are running first
- Run `npm start` to start local instance of `admin-portal`.
- Goto [http://loalhost:3000](http://loalhost:3000)

## Development

- Whenever there are changes in any backend GQL schema make sure to run `npm run download:schema`!
- Watch the terminal and console for warnings/errors, and ensure they are fixed before putting up our pull request.

# Testing

- run `npm test` to test all files. Conversely you can pass in a test file name/path to test a specific file or folder

  - VALID `npm test test-component.test.tsx` `npm test src/app/components/test-component` `npm test src/app/components/test-component/test-component.test.tsx`
  - INVALID `npm test test-component.tsx` `npm test ./src/app/components/test-component` `npm test packages/admin-portal/src/app/components/test-component`

- To run tests in watch mode, where tests will automatically run on save run `npm run test:watch`

- To see code coverage run `npm run test:coverage`

[Documentation for web testing guidelines/tips and principles](https://neofinancial.getoutline.com/doc/web-testing-QPIOXNnzYB)

## Troubleshooting

- If you get the following error: `Error: Attempted to call styled() from the server but styled is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.` in `admin-portal` add `'use-client';` at the top of `page.tsx`

- If you get the following error: `TypeError: Cannot redefine property: {someFunction} at Function.defineProperty (<anonymous>)` while using `jest.spyOn(SomeImport, 'someFunction')`: at the top of the file add

```
jest.mock('{relativeImportPath}', () => ({
  __esModule: true,
  ...jest.requireActual('{relativeImportPath}')
}));
```
