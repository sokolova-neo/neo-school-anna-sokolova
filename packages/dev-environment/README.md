# Dev Environment

Creates a development environment using docker.
Has AWS infrastructure based off of cloud config files in each service, and runs a local mongodb instance.

## Usage

> **NOTE**: On your first run, docker will download any images specified in the compose file.

- Run all dependencies: `npm start` or `docker-compose up`

When running:

- Display container logs: `npm run logs:mongodb`
- Connect to mongo shell: `npm run mongo`

### Local Topics and Queues

When starting localstack it will automatically create all the topics, queues and subscriptions defined in the cloud folders of each BE service.
