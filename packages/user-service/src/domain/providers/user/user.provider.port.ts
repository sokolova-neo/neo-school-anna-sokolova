import { RelativeCursorInput, RelativeCursorResultList } from '@neofinancial/neo-framework';

import { User } from '../../entities/user';

export interface UserProviderPort {
  getUser(id: string): Promise<User>;
  getUsers(input: RelativeCursorInput): Promise<RelativeCursorResultList<User>>;
  updateUser(id: string, update: Partial<Omit<User, 'id'>>): Promise<User>;
}
