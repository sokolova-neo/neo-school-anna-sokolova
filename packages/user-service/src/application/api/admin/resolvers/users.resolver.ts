import {
  AdminContext,
  AdminQueryResolver,
  AuthorizationRole,
  prepareRelativeCursorQueryInputForProvider,
  Resolver,
  Root,
} from '@neofinancial/neo-framework';

import { UserProviderPort } from '../../../../domain/providers/user/user.provider.port';
import { ProviderTokens } from '../../../../lib/provider-tokens';
import { inject } from '../../../../lib/strict-inject';
import { QueryUsersArgs, UserList } from '../../types/schema';

@Resolver
class UsersResolver extends AdminQueryResolver<UserList, QueryUsersArgs> {
  constructor(
    @inject(ProviderTokens.UserProvider)
    private userProvider: UserProviderPort,
  ) {
    super({
      requiredAuthRoles: [AuthorizationRole.CUSTOMER_OPS],
      field: 'users',
    });
  }

  async resolver(_: Root, args: QueryUsersArgs, _context: AdminContext): Promise<UserList> {
    const query = prepareRelativeCursorQueryInputForProvider(args.input);

    return this.userProvider.getUsers(query);
  }
}

export { UsersResolver };
