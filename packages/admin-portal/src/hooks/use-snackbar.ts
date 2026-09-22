import { useSnackbar as useNotistack } from 'notistack';
import { useCallback } from 'react';

interface SnackbarOptions {
  persist?: boolean;
  preventDuplicate?: boolean;
}

type ShowSnackbarFunction = (
  message: string,
  options?: SnackbarOptions,
) => void;

interface UseSnackbar {
  showError: ShowSnackbarFunction;
  showSuccess: ShowSnackbarFunction;
  showNeutral: ShowSnackbarFunction;
}

const useSnackbar = (): UseSnackbar => {
  const { enqueueSnackbar } = useNotistack();

  const showError = useCallback(
    (message: string, options?: SnackbarOptions): void => {
      enqueueSnackbar(message, { ...options, variant: 'error' });
    },
    [enqueueSnackbar],
  );

  const showSuccess = useCallback(
    (message: string, options?: SnackbarOptions): void => {
      enqueueSnackbar(message, { ...options, variant: 'success' });
    },
    [enqueueSnackbar],
  );

  const showNeutral = useCallback(
    (message: string, options?: SnackbarOptions): void => {
      enqueueSnackbar(message, { ...options, variant: 'info' });
    },
    [enqueueSnackbar],
  );

  return {
    showError,
    showSuccess,
    showNeutral,
  };
};

export { useSnackbar };
