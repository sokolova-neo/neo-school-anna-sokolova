// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { strictInjectDecoratorFactory } from '@neofinancial/neo-framework';

import { ProviderTokensType } from './provider-tokens';
import { ProducerTokensType } from './producer-tokens';
import { RepositoryTokensType } from './repository-tokens';
import { RepositoryHookTokensType } from './hook-tokens';

const inject = strictInjectDecoratorFactory<
  ProviderTokensType | ProducerTokensType | RepositoryTokensType | RepositoryHookTokensType
>();

export { inject };
