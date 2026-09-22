import path from 'path';
import fs from 'fs';
import { snakeCase } from 'lodash';
import { exec } from 'child_process';
import { asyncLogger as logger } from '@neofinancial/neo-framework';

import { ServiceList } from './service-list';

interface ComposeLocalSchemaInput {
  runningServices: ServiceList;
  offlineServices: ServiceList;
  schemaFileName: string;
}

type SubgraphDefinition = Record<
  string,
  {
    routing_url: string;
    schema: { subgraph_url: string } | { file: string };
  }
>;

interface SupergraphDefinition {
  federation_version: string;
  subgraphs: SubgraphDefinition;
}

const getSchemaForOfflineService = (serviceName: string): string => {
  const basePath = path.resolve(path.join(process.cwd(), '..'));
  const schemaPath = path.join(basePath, serviceName, 'lib');

  return schemaPath;
};

const constructSupergraphDefinition = (
  runningServices: ServiceList,
  offlineServices: ServiceList,
): SupergraphDefinition => {
  const subgraphs: SubgraphDefinition = {};

  runningServices.forEach((service) => {
    const serviceName = snakeCase(service.name);

    if (!service.url) {
      return;
    }

    subgraphs[serviceName] = {
      routing_url: service.url,
      schema: {
        subgraph_url: service.url,
      },
    };
  });

  offlineServices.forEach((service) => {
    const serviceName = snakeCase(service.name);
    const schemaFilePath = getSchemaForOfflineService(service.name);

    if (!fs.existsSync(schemaFilePath)) {
      logger.warn(
        `Expected to find a local schema file for ${service.name} at ${schemaFilePath}, but didn't. Do you have the repository checked out?`,
      );
    }

    subgraphs[serviceName] = {
      routing_url: service.url ?? 'http://localhost/stub',
      schema: {
        file: schemaFilePath,
      },
    };
  });

  return {
    // federation_version needs to exactly match the @apollo/gateway package version
    federation_version: '=2.4.6',
    subgraphs,
  };
};

const constructSupergraphSchema = (supergraphDefinition: SupergraphDefinition): Promise<string> => {
  const supergraphConfigFileName = 'supergraph.generated.yaml';

  fs.writeFileSync(supergraphConfigFileName, JSON.stringify(supergraphDefinition, null, 2));

  const roverPath = path.join(process.cwd(), 'node_modules', '.bin', 'rover');

  if (!fs.existsSync(roverPath)) {
    throw new Error('Unable to compose supergraph as Rover was not found. Do you need to run "npm install"?');
  }

  return new Promise((resolve, reject) => {
    logger.info(`Composing local supergraph...`);

    exec(
      `${roverPath} supergraph compose --config ${supergraphConfigFileName} --elv2-license=accept --skip-update-check --client-timeout=1000`,
      (err, stdout) => {
        if (err) {
          return reject(err);
        }

        resolve(stdout);
      },
    );
  });
};

const composeLocalSchema = async ({ runningServices, offlineServices }: ComposeLocalSchemaInput): Promise<string> => {
  if (runningServices.length === 0 && offlineServices.length === 0) {
    throw new Error('Expected at least one service definition to be provided to create a local schema.');
  }

  const supergraphDefinition = constructSupergraphDefinition(runningServices, offlineServices);
  const schema = constructSupergraphSchema(supergraphDefinition);

  return schema;
};

export { composeLocalSchema };
