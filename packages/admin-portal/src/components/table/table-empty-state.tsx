import { Box, Typography } from '@neofinancial/morpheus-components';
import { Bill } from '@neofinancial/morpheus-icons';

export interface TableEmptyStateProps {
  emptyState?: string;
}

export default function TableEmptyState({ emptyState }: TableEmptyStateProps) {
  return (
    <Box
      justifyContent="center"
      marginLeft="auto"
      marginRight="auto"
      flexDirection="column"
      alignItems="center"
      display="flex"
      marginTop="spaceXXXL"
    >
      <Bill size={88} color="contentDisabled" />
      <Box marginTop="spaceS">
        <Typography variant="bodyL" color="contentSubdued">
          {emptyState ?? 'No data'}
        </Typography>
      </Box>
    </Box>
  );
}
