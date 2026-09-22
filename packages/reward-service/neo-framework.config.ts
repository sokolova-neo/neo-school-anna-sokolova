import type { NeoFrameworkConfig } from '@neofinancial/neo-framework';

const config: NeoFrameworkConfig = {
  buildTimeCodegen: {
    graphql: {
      schemaTypes: {
        schemas: [
          {
            schemaPath: './lib/schema.graphql',
            outputPath: 'src/application/api/types/schema.d.ts',
          },
        ],
      },
    },
    providers: {
      injectionTokens: {
        outputPath: './src/lib/provider-tokens.ts',
      },
    },
    repositories: {
      injectionTokens: {
        outputPath: './src/lib/repository-tokens.ts',
      },
    },
    producers: {
      injectionTokens: {
        outputPath: './src/lib/producer-tokens.ts',
      },
    },
    repositoryHooks: {
      injectionTokens: {
        outputPath: './src/lib/hook-tokens.ts',
      },
    },
    strictInject: {
      outputPath: './src/lib/strict-inject.ts',
    },
  },
};

export { config };
