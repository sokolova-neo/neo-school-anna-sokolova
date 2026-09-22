# neo-school-rebirth

No Stack to Neo Stack in 20 days.

There are six packages in this monorepo:

1. _dev-environment_: Initializes a docker dev environment with a mongo database, sets up SNS topics, and SQS queues.
2. _admin-portal_: Web portal for updating and viewing user details/transactions.
3. _user-service_: Package that contains code for the microservice user-service.
4. _transaction-service_: Package that contains code for the microservice transaction-service.
5. _reward-service_: Package that contains code for the microservice reward-service.
6. _gateway_: Package that contains code for the GraphQL Apollo gateway.

## Context

Welcome to Neo Financial. We are here to build a more rewarding financial experience that empowers Canadians to take control of their future.

### Tools

In our backend services we use:

- Typescript with Node
- GraphQL
- MongoDB
- SNS and SQS for the message communication

In the frontend we use:

- Typescript with React
- [Morpheus](https://morpheus.neofinancial.dev/) is our design system
- In case you need a component not covered by Morpheus, you can use [MaterialUI](https://mui.com/material-ui)
- For forms, we use react-hook-form and zod

### Architecture

We use Hexagonal Architecture within a service and, Event-Driven Architecture for the communication between services.

## Prerequisites

Most of the steps are listed [here](https://neofinancial.getoutline.com/doc/account-setup-qXL24Ub0vy "Account setup wiki") but the core steps are listed below.

1. npm

- **_!!IMPORTANT!!_** Make sure npm **_IS NOT INSTALLED_**
- npmjs.org account created; start [here](https://www.npmjs.com/signup "npmjs signup")
- access to [neofinancial packages](https://www.npmjs.com/settings/neofinancial/packages "npm neofinancial packages")
  - Submit a Jira to request access [here](https://neofinancial.atlassian.net/servicedesk/customer/portal/1/group/149)
  - Select Engineering Requests
  - Select Engineering System Accounts
- `nvm` installed
- `nvm install 22`
- logged into npm cli; run `npm login`

2. git/GitHub

- have git installed and configured; steps [here](https://neofinancial.getoutline.com/doc/configure-git-uUClvjO93T "Configure git wiki")
- optional: have GitHub cli installed
- gpg key set up: steps [here](https://neofinancial.getoutline.com/doc/signing-commits-IutbfvZVfF "Setting up signed commits")

3. Dev environment

- [Docker](https://neofinancial.getoutline.com/doc/installing-docker-oifACx6d3g "Docker setup wiki")
- [Mongo Client GUI](https://neofinancial.getoutline.com/doc/viewing-data-RhxZpTiW9p "Viewing data wiki")
- Last and most importantly: A code editor! ....or a text editor :P

## Getting started

1. Create a copy of the repository through the "Use this template" button in GitHub. The name of the new repository should be: neo-school-\<YOUR NAME HERE>
2. Check GitHub and make sure your repo is there with all of its code.
3. Clone the new repository to your machine.

## Some documentation for onboarding and coding standards at neo

- [30-60-90 day goals](https://docs.google.com/document/d/1UxJOW2Kqly-AoikG5NbDg1AinY98kwvJzfxl_v7Bhoo)
- [Some neo coding standards](https://neofinancial.getoutline.com/doc/style-guide-BeLjv14vUi)
- [Testing in the front end](https://neofinancial.getoutline.com/doc/web-testing-QPIOXNnzYB)

## Running the code:

1. Run `npm run install:all` to install dependencies for all packages; This should be done in the root neo-school folder. Make sure you've successfully configured `.npmrc` to access the private npm registry before this step.
2. Run `npm start` in the root folder to start the client and all services in parallel. If you get certificate errors, check the troubleshooting session.
3. Open a new terminal and run `npm run seed:all` to seed your local database. This only needs to be run once.

Note: Alternatively, to run each service in separate terminals you can either:

1. Run `npm run start:backend` in the root folder to start all required back-end services then `npm run start:admin-portal`

**OR**

1. Run `npm start` in `packages/dev-environment`to start a docker container
2. Run `npm start` in each package to start client/service: Order of starting should be:

- `dev-environment`(started in step 1)
- `reward-service`, `transaction-service`, `user-service` in any order
- `gateway`
- `admin-portal`

3. Open a new terminal and run `npm run seed` in each back end service to seed your local database.

## Server Notes

- If you make any changes to the GraphQL schema you will need to regenerate the TypeScript GraphQL types. To do this run `npm run generate:types`. This is also run automatically on commit. To ignore minor typescript errors you can run `npm run generate:types:force` which will run the same as `npm run generate:types` but log typescript errors to the console instead of stopping.

- If you create new provider, producers, or repositories you will need to generate the inject tokens. To do this run `npm run build`. This is also run automatically on commit.

## Client Notes

- Watch the terminal for warnings, and ensure they are fixed before putting up your pull request.

### Troubleshooting

- If you have any questions, please do so in the channel #neo-school-help

  - Using the search functionality in Slack is also very useful! People often post when they encounter errors so it's likely that someone else has encountered the same or similar errors that you'll run into

- If you run into any issues with the `npm run seed:all` script, try `cd`-ing into each service's directory and running `npm run seed` one-by-one

  - You'll likely need to drop any partially seeded collections, especially `rewardPlans` since those documents have a unique index

- If you are having typescript errors ensure you are using the workspace version(4.7.4)!

1. `cmd` + `shift` + `p` OR `ctrl` + `shift` + `p`
2. Start typing `Typescript: select typescript version...`
   If an option does not show up, open up any `tsconfig.json` file, and start from 1.

3. Select `Use Workspace Version`

- If you are getting an `AWS.SimpleQueueService.NonExistentQueue` error on starting of a service `cd packages/dev-environment` and `npm run init`; This will create queues/topics from the cloud folder.
  If the issue persists ensure that the queue/topics are named correctly in cloud folder/config files!

- If you get the following error: `Error: Attempted to call styled() from the server but styled is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.` in `admin-portal` add `'use-client';` at the top of `page.tsx`

- You npm start does not start the `gateway`, possibly you can fix that replacing all the words: `localhost` with `127.0.0.1`

- If you get certificate errors when running the project locally and you haven't installed Netskope, it's likely because you don't have access to the Neo Org on GitHub yet. This prevents the necessary certificates from being automatically installed. To fix this, you need to manually trust the root certificate authority (CA) that's intercepting your traffic by running the command below:

  ```sh
  colima ssh -- sudo sh -c 'cd /etc/ssl/certs && openssl s_client -showcerts -connect registry.hub.docker.com:443 < /dev/null | awk "/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/ {if (/-----BEGIN CERTIFICATE-----/) {if (out) close(out); out=\"certificate_mitm_\" ++n \".pem\"}; print > out}" && update-ca-certificates --fresh' && colima restart
  ```
