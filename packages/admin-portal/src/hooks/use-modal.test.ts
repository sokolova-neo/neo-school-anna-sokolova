import { useModal } from './use-modal';
import {
  act,
  renderHookWithProviders,
  waitFor,
} from '../../test/lib/test-utils';

describe('useModal', () => {
  const initialIsOpen = true;
  const renderUseModal = (init?: boolean) =>
    renderHookWithProviders(() => useModal(init ?? initialIsOpen));

  test('have isOpen the same as initialIsOpen', async () => {
    const { isOpen } = renderUseModal().result.current;

    expect(isOpen).toBe(initialIsOpen);
  });

  test('have isOpen set to true when handleOpen is called', async () => {
    const { isOpen, handleOpen } = renderUseModal(false).result.current;

    act(() => {
      handleOpen();
    });

    waitFor(() => {
      expect(isOpen).toBe(true);
    });
  });

  test('have isOpen set to false when handleClose is called', async () => {
    const { isOpen, handleClose } = renderUseModal(true).result.current;

    act(() => {
      handleClose();
    });

    waitFor(() => {
      expect(isOpen).toBe(false);
    });
  });
});
