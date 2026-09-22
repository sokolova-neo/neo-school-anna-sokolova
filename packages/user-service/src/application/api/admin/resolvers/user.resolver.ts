import { Province } from '@neofinancial/neo-date';
import {
  AdminContext,
  AdminMutationResolver,
  AdminQueryResolver,
  AuthorizationRole,
  Resolver,
  Root,
} from '@neofinancial/neo-framework';

import { UserProviderPort } from '../../../../domain/providers/user/user.provider.port';
import { ProviderTokens } from '../../../../lib/provider-tokens';
import { inject } from '../../../../lib/strict-inject';
import {
  MutationUpdateUserContactArgs,
  MutationUpdateUserDetailsArgs,
  QueryUserArgs,
  UpdateUserContactResponse,
  UpdateUserDetailsResponse,
  User,
} from '../../types/schema';

@Resolver
class UserResolver extends AdminQueryResolver<User> {
  constructor(
    @inject(ProviderTokens.UserProvider)
    private userProvider: UserProviderPort,
  ) {
    super({
      requiredAuthRoles: [AuthorizationRole.CUSTOMER_OPS],
      field: 'user',
    });
  }

  async resolver(_: Root, args: QueryUserArgs, _context: AdminContext): Promise<User> {
    return this.userProvider.getUser(args.id);
  }
}

@Resolver
class UpdateUserDetailsResolver extends AdminMutationResolver<UpdateUserDetailsResponse> {
  constructor(
    @inject(ProviderTokens.UserProvider)
    private userProvider: UserProviderPort,
  ) {
    super({
      requiredAuthRoles: [AuthorizationRole.CUSTOMER_OPS],
      field: 'updateUserDetails',
    });
  }

  async resolver(
    _: Root,
    args: MutationUpdateUserDetailsArgs,
    _context: AdminContext,
  ): Promise<UpdateUserDetailsResponse> {
    const { userId, firstName, lastName, preferredName, province } = args.input;

    const user = await this.userProvider.updateUser(userId, {
      firstName,
      lastName,
      preferredName,
      province: province as Province,
    });

    return {
      user,
    };
  }
}

@Resolver
class UpdateUserContactResolver extends AdminMutationResolver<UpdateUserContactResponse> {
  constructor(
    @inject(ProviderTokens.UserProvider)
    private userProvider: UserProviderPort,
  ) {
    super({
      requiredAuthRoles: [AuthorizationRole.CUSTOMER_OPS],
      field: 'updateUserContact',
    });
  }

  async resolver(
    _: Root,
    args: MutationUpdateUserContactArgs,
    _context: AdminContext,
  ): Promise<UpdateUserContactResponse> {
    const { userId, email, phone } = args.input;

    const user = await this.userProvider.updateUser(userId, {
      email,
      phone,
    });

    return {
      user,
    };
  }
}

export { UserResolver, UpdateUserDetailsResolver, UpdateUserContactResolver };
