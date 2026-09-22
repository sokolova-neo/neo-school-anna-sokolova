import {
  Provider,
  RelativeCursorInput,
  RelativeCursorResultList,
  ResourceNotFoundError,
} from '@neofinancial/neo-framework';

import { RepositoryTokens } from '../../../lib/repository-tokens';
import { inject } from '../../../lib/strict-inject';
import { User } from '../../entities/user';
import { UserRepositoryPort } from '../../repositories/user.repository.port';
import { UserProviderPort } from './user.provider.port';

@Provider
class UserProviderAdapter implements UserProviderPort {
  constructor(
    @inject(RepositoryTokens.UserRepository)
    private userRepository: UserRepositoryPort,
  ) {}

  public async getUser(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  public async getUsers(input: RelativeCursorInput): Promise<RelativeCursorResultList<User>> {
    return this.userRepository.findByRelativeCursorQuery(input);
  }

  public async updateUser(id: string, update: Partial<User>): Promise<User> {
    const user = await this.userRepository.updateOneByFields({ id }, update);

    if (!user) {
      throw new ResourceNotFoundError('User not found.', {
        clientData: {
          resourceName: 'User',
        },
        logToSentry: 'MEDIUM',
      });
    }

    return user;
  }
}

export { UserProviderAdapter };
