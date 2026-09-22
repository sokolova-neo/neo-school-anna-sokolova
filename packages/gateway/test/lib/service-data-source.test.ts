/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLDataSourceProcessOptions } from '@apollo/gateway';
import { GraphQLDataSourceRequestKind } from '@apollo/gateway/dist/datasources/types';

import { AdminContext } from '@neofinancial/neo-framework';

import { AdminServiceDataSource, getTriageTeamTagByUrl } from '../../src/lib/service-data-source';
import { encode } from '../helpers/token.helper';

describe('AdminServiceDataSource', () => {
  test('willSendRequest', async () => {
    const ds = new AdminServiceDataSource();
    const token = await encode({ adminId: '0' }, 'FAKE_SECRET', '24h');

    const mockContext = {
      sessionData: {
        token: token,
        tokenExpiresAt: new Date().getTime(),
      },
      adminUser: {
        id: '0',
      },
    } as unknown as AdminContext;

    const mockRequest: GraphQLDataSourceProcessOptions<AdminContext> = {
      request: {
        http: {
          headers: {
            set: (_: string, __: any): void => undefined,
          },
        },
      } as any,
      kind: GraphQLDataSourceRequestKind.INCOMING_OPERATION,
      context: mockContext,
      incomingRequestContext: {
        context: mockContext,
      } as any,
    };

    // TODO this doesn't pass isTokenValid
    await expect(() => ds.willSendRequest(mockRequest)).rejects.toThrow('Invalid Credentials');
  });

  test('didReceiveResponse', async () => {
    const ds = new AdminServiceDataSource();

    const mockResponse = {
      response: {
        extensions: {
          adminToken: '0',
          adminTokenExpiresAt: new Date().getTime(),
        },
      } as any,
      context: {
        sessionData: {
          token: '0',
          tokenExpiresAt: new Date().getTime(),
        },
      } as unknown as AdminContext,
    };

    ds.didReceiveResponse(mockResponse);

    expect(true).toBeTruthy();
  });

  describe('getTriageTeamTagByUrl', () => {
    test('returns the correct team name for urls with neofinancial domains', () => {
      expect(getTriageTeamTagByUrl('http://reward-service.integration.neofinancial.xyz')).toEqual('rewards');
      expect(getTriageTeamTagByUrl('https://user-service.production.neofinancial.com')).toEqual('engineering');
      expect(getTriageTeamTagByUrl('https://transaction-service.production.neofinancial.com')).toEqual('growth');
    });

    test('returns undefined when service within the url does not match a team', () => {
      expect(getTriageTeamTagByUrl('http://fake-service.integration.neofinancial.xyz')).toBeUndefined();
      expect(getTriageTeamTagByUrl('https://a-2nd-fake-service.integration.neofinancial.xyz')).toBeUndefined();
    });

    test('returns undefined when the url is of an unexpected format', () => {
      expect(getTriageTeamTagByUrl('http://rewards-service')).toBeUndefined();
      expect(getTriageTeamTagByUrl('rewards-service')).toBeUndefined();
    });
  });
});
