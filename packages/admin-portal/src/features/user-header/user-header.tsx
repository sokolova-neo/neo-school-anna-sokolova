import { Box, IconButton, Typography } from '@neofinancial/morpheus-components';
import { Close } from '@neofinancial/morpheus-icons';

import { useUserHeader } from './providers/use-user-header';

function UserHeader({ userId }: { userId: string }) {
  const { timeZoneText, displayName, onExit, loading, error } = useUserHeader({
    userId,
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      padding="spaceL"
      bgcolor="backgroundInverse"
    >
      <Box display="flex" alignItems="center">
        <IconButton variant="primary" onClick={onExit}>
          <Close data-testid="exit-icon" color="contentDefaultInverse" />
        </IconButton>
        {!loading && !error && (
          <Typography color="contentDefaultInverse" variant="headingM">
            {displayName}
          </Typography>
        )}
      </Box>
      {!loading && !error && (
        <Typography color="contentDefaultInverse" variant="bodyL">
          {timeZoneText}
        </Typography>
      )}

      {error && (
        <Typography color="negative" variant="bodyL">
          An error occured fetching data. &quot;{error.message}&quot;
        </Typography>
      )}
    </Box>
  );
}

export { UserHeader };
