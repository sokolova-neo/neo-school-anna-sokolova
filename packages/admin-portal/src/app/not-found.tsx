'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@neofinancial/morpheus-components';
import { ThumbsDown } from '@neofinancial/morpheus-icons';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      flexDirection="column"
      display="flex"
      margin="auto"
      marginTop="spaceL"
      maxWidth="1016px"
      alignItems="center"
    >
      <ThumbsDown size={128} spacing={50} />
      <Typography variant="headingM" margin={50}>
        Oh no! The page you are looking for does not exist!
      </Typography>
      <Button
        size="large"
        variant="primary"
        width="padded"
        onClick={() => router.back()}
      >
        Go Back
      </Button>
    </Box>
  );
}
