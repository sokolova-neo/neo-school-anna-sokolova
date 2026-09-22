import {
  Grid,
  Box,
  Typography,
  Spinner,
} from '@neofinancial/morpheus-components';
import { useUserDetails } from './providers/use-user-details';
import { TitleRow } from './components/title-row';
import { DetailRow } from './components/detail-row';
import { PersonalDataModal } from '../personal-data-modal/personal-data-modal';

const UserDetails = ({ userId }: { userId: string }): React.ReactElement => {
  const {
    errorMessage,
    loading,
    user,
    isPersonalDataModalOpen,
    handleOpenPersonalDataModal,
    handleClosePersonalDataModal,
  } = useUserDetails({
    userId,
  });

  if (loading) {
    return <Spinner />;
  }

  if (errorMessage) {
    return <Typography variant="headingM">{errorMessage}</Typography>;
  }

  if (!user) {
    return <Typography variant="headingM">User not found</Typography>;
  }

  return (
    <Box margin="spaceL">
      <Typography variant="headingS">Customer Details</Typography>
      <Box padding="spaceM" marginTop="spaceM">
        <Box paddingBottom="spaceXL">
          <Typography variant="headingXS" display="inline">
            Account Status:
          </Typography>
          <Typography
            variant="headingXS"
            color="positive"
            display="inline"
          >{` ${user.status}`}</Typography>
        </Box>
        <Grid
          container
          display="flex"
          justifyContent="flex-start"
          alignContent="flex-start"
        >
          <Grid
            item
            container
            xs={12}
            md={5}
            spacing={16}
            display="flex"
            flexDirection="column"
          >
            <TitleRow
              label="Personal Data"
              action={handleOpenPersonalDataModal}
            />
            <DetailRow label="Customer ID" value={user.id} />
            <DetailRow label="Legal First Name" value={user.firstName} />
            <DetailRow
              label="Preferred Name"
              value={user.preferredName || 'N/A'}
            />
            <DetailRow label="Legal Last Name" value={user.lastName} />
            <DetailRow label="Province" value={user.province} />
          </Grid>
          <Grid item container md={1} spacing={16} />
          <Grid
            item
            container
            xs={12}
            md={5}
            spacing={16}
            display="flex"
            flexDirection="column"
          >
            <TitleRow label="Contact Information" action={() => {}} />
            <DetailRow label="Primary Email" value={user.email} />
            <DetailRow label="Phone Number" value={user.phone} />
          </Grid>
        </Grid>
      </Box>
      <PersonalDataModal
        isPersonalDataModalOpen={isPersonalDataModalOpen}
        handleClosePersonalDataModal={handleClosePersonalDataModal}
        user={user}
      />
    </Box>
  );
};

export { UserDetails };
