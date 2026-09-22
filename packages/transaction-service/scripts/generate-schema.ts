import fs from 'fs';
import path from 'path';

import { generateSchemaFromTypeDefs, generateSchemaFromIntrospection } from '@neofinancial/neo-framework';

import { getSchema, getTypeDefs } from '../src/application/api/admin/schema';
import { getDependencyRegistryInstance } from '../src/configuration/dependency-registry';

getDependencyRegistryInstance();

const libPath = path.join(__dirname, '..', 'lib');

(async (): Promise<void> => {
  if (!fs.existsSync(libPath)) {
    fs.mkdirSync(libPath);
  }

  fs.writeFileSync(path.join(libPath, 'schema.graphql'), generateSchemaFromTypeDefs(getTypeDefs()));

  fs.writeFileSync(path.join(libPath, 'federated-schema.graphql'), await generateSchemaFromIntrospection(getSchema()));
})();
