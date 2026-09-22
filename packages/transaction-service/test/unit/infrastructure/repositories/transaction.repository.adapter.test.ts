import { connect, Mongoose, vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { TransactionRepositoryAdapter } from '../../../../src/infrastructure/repositories/transaction/transaction.repository.adapter';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import { transactionFactory } from '../../../factories/transaction/transaction.factory';
import { TransactionRepositoryHookAdapter } from '../../../../src/infrastructure/repositories/transaction/transaction.repository.hook';

describe('TransactionRepositoryAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const stubTransactionRepositoryHook = vstub<TransactionRepositoryHookAdapter>();
  let db: Mongoose;
  let repository: TransactionRepositoryAdapter;

  beforeAll(async () => {
    dependencyRegistry.registerInstance(TransactionRepositoryHookAdapter, stubTransactionRepositoryHook);
    db = await connect(dependencyRegistry.resolve(Mongoose));
    repository = dependencyRegistry.resolve(RepositoryTokens.TransactionRepository);
  });

  beforeEach(async () => {
    vi.resetAllMocks();
    await db.connection.dropDatabase();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('toObject', () => {
    it('should create a transaction object', async () => {
      const transaction = transactionFactory.build();
      const result = await repository.create(transaction);

      expect(result).toEqual(transaction);
    });
  });

  describe('onCreate hook', () => {
    it('should be called when a document is created', async () => {
      const transaction = transactionFactory.build();

      await repository.create(transaction);

      expect(stubTransactionRepositoryHook.onCreate).toHaveBeenCalledTimes(1);
      expect(stubTransactionRepositoryHook.onCreate).toHaveBeenCalledWith(transaction);
    });
  });

  describe('getOrCreateOneByExternalId', () => {
    const transaction = transactionFactory.build();

    it('should create a transaction if it does not exist', async () => {
      const result = await repository.getOrCreateOneByExternalId(transaction.externalId, transaction);

      expect(result).toEqual(transaction);
    });

    it('should get a transaction if it already exists', async () => {
      await repository.create(transaction);

      const result = await repository.getOrCreateOneByExternalId(transaction.externalId, transaction);

      expect(result).toEqual(transaction);
    });

    it('should retry on duplicate error', async () => {
      const transaction = transactionFactory.build();
      const findSpy = vi
        .spyOn(repository, 'findOneByFields')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(transaction);

      vi.spyOn(repository, 'create').mockRejectedValueOnce({ code: 11000 });

      await repository.getOrCreateOneByExternalId(transaction.externalId, transaction);

      expect(findSpy).toHaveBeenCalledTimes(2);
    });

    it('should call onCreate hook', async () => {
      await repository.create(transaction);

      await repository.getOrCreateOneByExternalId(transaction.externalId, transaction);

      expect(stubTransactionRepositoryHook.onCreate).toHaveBeenCalledOnce();
      expect(stubTransactionRepositoryHook.onCreate).toHaveBeenCalledWith(transaction);
    });
  });
});
