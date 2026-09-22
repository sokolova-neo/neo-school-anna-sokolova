import { BaseRepositoryPort } from '@neofinancial/neo-framework';

import { User } from '../entities/user';

export type CreateUser = Omit<User, 'id'>;

export type UpdateUser = Partial<Omit<User, 'id'>>;

type Repository = Pick<
  BaseRepositoryPort<User, CreateUser, UpdateUser>,
  'create' | 'findOneByFields' | 'findById' | 'updateOneByFields' | 'findByRelativeCursorQuery'
>;

export interface UserRepositoryPort extends Repository {}
