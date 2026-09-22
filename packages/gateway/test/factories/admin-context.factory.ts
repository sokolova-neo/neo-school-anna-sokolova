import { faker } from '@faker-js/faker';

import {
  AdminContext,
  AuthorizationRole,
  ClientCategory,
  ClientPlatform,
  ContextType,
  Language,
  RequestSender,
} from '@neofinancial/neo-framework';
import { NeoFactory as Factory } from '@neofinancial/neo-test-factory';

class AdminContextFactory extends Factory<AdminContext> {
  sessionId(id?: string) {
    return this.params({ sessionData: { id: id } });
  }

  roles(roles: AuthorizationRole[]) {
    return this.params({ roles });
  }

  language(lang: Language) {
    return this.params({ client: { language: lang } });
  }
}

export const adminContextFactory = AdminContextFactory.define(() => {
  const adminId = faker.database.mongodbObjectId();

  return {
    adminUser: {
      id: adminId,
      googleId: adminId,
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      picture: faker.image.avatar(),
      roles: faker.helpers.arrayElements(
        Object.values(AuthorizationRole),
        faker.number.int({
          min: 1,
          max: Object.entries(AuthorizationRole).length,
        }),
      ),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
    sessionData: {
      id: adminId,
      adminId,
      token: 'JWT-Token',
      tokenExpiresAt: faker.date.between({ from: Date.now(), to: faker.date.soon() }).toISOString(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
    requestId: faker.database.mongodbObjectId(),
    client: {
      platform: faker.helpers.enumValue(ClientPlatform),
      category: faker.helpers.enumValue(ClientCategory),
      ipAddress: faker.internet.ip(),
      osVersion: faker.internet.userAgent(),
      language: faker.helpers.enumValue(Language),
    },
    requestSender: faker.helpers.enumValue(RequestSender),
    contextType: ContextType.ADMIN as ContextType.ADMIN,
    queryCost: 0,
    permissions: [],
    roles: [],
    adminId,
  };
});
