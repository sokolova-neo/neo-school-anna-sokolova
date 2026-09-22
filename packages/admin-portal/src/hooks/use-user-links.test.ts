import { useUserLinks } from './use-user-links';
import { renderHookWithProviders } from '../../test/lib/test-utils';

describe('useUserLinks', () => {
  const userId = 'some-id';
  const renderUseUserLinks = () =>
    renderHookWithProviders(() => useUserLinks({ id: userId }));

  describe('links', () => {
    test('have correct values based on user id', async () => {
      const { overviewLink, transactionsLink } =
        renderUseUserLinks().result.current;

      expect(overviewLink).toBe('/users/some-id/details');
      expect(transactionsLink).toBe('/users/some-id/transactions');
    });
  });
});
