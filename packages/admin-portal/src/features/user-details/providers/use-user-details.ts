import { useModal } from '@/hooks/use-modal';
import { useUserDetailsQuery, mapToUser } from '../api/use-user-details-query';
import { type User } from '../../../types/user';

interface UseUserDetailsResult {
  user?: User;
  errorMessage?: string;
  loading: boolean;
  isPersonalDataModalOpen: boolean;
  handleOpenPersonalDataModal: () => void;
  handleClosePersonalDataModal: () => void;
}

const useUserDetails = ({
  userId,
}: {
  userId: string;
}): UseUserDetailsResult => {
  const {
    handleOpen: handleOpenPersonalDataModal,
    handleClose: handleClosePersonalDataModal,
    isOpen: isPersonalDataModalOpen,
  } = useModal();
  const { error, loading, data } = useUserDetailsQuery({
    variables: {
      input: userId,
    },
  });

  return {
    user: data?.user && mapToUser(data?.user),
    loading,
    errorMessage: error?.message,
    isPersonalDataModalOpen,
    handleOpenPersonalDataModal,
    handleClosePersonalDataModal,
  };
};

export { useUserDetails };
