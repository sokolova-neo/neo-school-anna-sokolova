import { asyncLogger as logger, OnCreateCallbackPartial, RepositoryHook } from '@neofinancial/neo-framework';

import { ReplicatedUser } from '../../../domain/entities/replicated-user/replicated-user';

@RepositoryHook
class ReplicatedUserRepositoryHook implements OnCreateCallbackPartial<ReplicatedUser> {
  public onCreate = async (freshlyReplicatedUser: ReplicatedUser): Promise<void> => {
    logger.debug('Not yet implemented', {
      logData: {
        freshlyReplicatedUser,
      },
    });
  };
}

export { ReplicatedUserRepositoryHook };
