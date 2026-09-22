import { OperationTypeNode } from 'graphql';

import { AuthorizationRole, HttpEvent } from '@neofinancial/neo-framework';

type Report = {
  requestId: string | undefined;
  successful: boolean;
  method: OperationTypeNode | undefined;
  occurredAt: Date | undefined;
  payload: Record<string, unknown> | undefined;
  adminId: string | undefined;
  ipAddress: string | undefined;
  kind: HttpEvent | undefined;
  query: string | undefined;
  roles: AuthorizationRole[] | undefined;
  operation: string;
};

type SocketError = {
  code: string;
  message: string;
};

type ExtendedSessionData = {
  adminId?: string;
};

type ExtendedAdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  roles: AuthorizationRole[] | undefined;
};

export { Report, SocketError, ExtendedSessionData, ExtendedAdminUser };
