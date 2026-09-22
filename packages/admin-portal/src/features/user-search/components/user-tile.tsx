import { Tile, Typography, Grid, Box } from '@neofinancial/morpheus-components';
import MuiLink from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { useUserLinks } from '../../../hooks/use-user-links';

export interface UserTileProps {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const Link = styled(MuiLink)`
  text-decoration: none;
`;

const UserTile = ({
  name,
  email,
  phone,
  id,
}: UserTileProps): React.ReactElement => {
  const { overviewLink, transactionsLink } = useUserLinks({ id });

  return (
    <Tile>
      <Box
        marginTop="spaceL"
        marginBottom="spaceL"
        marginLeft="spaceXXL"
        marginRight="spaceXXL"
      >
        <Grid container>
          <Grid item xs={8}>
            <Box marginBottom="spaceXXS">
              <Typography color="accent" variant="bodyLongL">
                {name}
              </Typography>
            </Box>
            <Typography variant="bodyLongL">{email}</Typography>
            <Box marginTop="spaceXXS">
              <Typography variant="bodyLongL">{phone}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box marginBottom="spaceXXS">
              <Link href={overviewLink}>
                <Typography color="accent" variant="bodyLongL">
                  Overview
                </Typography>
              </Link>
            </Box>
            <Link href={transactionsLink}>
              <Typography color="accent" variant="bodyLongL">
                Transactions
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Tile>
  );
};

export { UserTile };
