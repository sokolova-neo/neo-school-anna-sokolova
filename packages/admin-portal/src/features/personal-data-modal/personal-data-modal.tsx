import {
  Box,
  Modal,
  TextField,
  Button,
  Select,
} from '@neofinancial/morpheus-components';
import { Controller } from 'react-hook-form';
import { type User } from '../../types/user';
import { usePersonalData } from './provider/use-personal-data';

const PersonalDataModal = ({
  isPersonalDataModalOpen,
  handleClosePersonalDataModal,
  user,
}: {
  isPersonalDataModalOpen: boolean;
  handleClosePersonalDataModal: () => void;
  user: User;
}): React.ReactElement => {
  const { submit, control, errors, handleClose, loading, hasError, provinces } =
    usePersonalData({
      user,
      closeModal: handleClosePersonalDataModal,
    });

  return (
    <Modal
      open={isPersonalDataModalOpen}
      onClose={handleClose}
      title="Editing personal data"
      alignTitle="left"
      width={485}
    >
      <Box
        marginTop="none"
        paddingLeft="spaceXXL"
        paddingRight="spaceXXL"
        paddingBottom="spaceXXL"
      >
        <Box marginBottom="spaceM">
          <TextField
            fullWidth
            label="Customer ID"
            type="text"
            disabled
            {...control.register('userId')}
          />
        </Box>
        <Box marginBottom="spaceM">
          <TextField
            fullWidth
            label="First Name"
            type="text"
            disabled={loading}
            {...control.register('firstName')}
            helperText={errors.firstName?.message}
            error={!!errors.firstName}
          />
        </Box>
        <Box marginBottom="spaceM">
          <TextField
            fullWidth
            label="Last Name"
            type="text"
            disabled={loading}
            {...control.register('lastName')}
            helperText={errors.lastName?.message}
            error={!!errors.lastName}
          />
        </Box>
        <Box marginBottom="spaceM">
          <TextField
            fullWidth
            label="Preferred Name"
            type="text"
            disabled={loading}
            {...control.register('preferredName')}
            helperText={errors.preferredName?.message}
            error={!!errors.preferredName}
          />
        </Box>
        <Box marginBottom="spaceM">
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <Select
                label="Province"
                disabled={loading}
                helperText={errors.province?.message}
                error={!!errors.province}
                options={provinces}
                {...field}
              />
            )}
          />
        </Box>
        <Button
          size="large"
          variant="primary"
          width="fullWidth"
          onClick={submit}
          disabled={hasError || loading}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export { PersonalDataModal };
