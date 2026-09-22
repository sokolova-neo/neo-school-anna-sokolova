'use client';

import {
  Spinner,
  Typography,
  Box,
  Grid,
  SearchField,
  Pagination,
} from '@neofinancial/morpheus-components';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import { useUserSearch } from './providers/use-user-search';
import { UserTile } from './components/user-tile';
import { formatName } from '../../lib/formatter';

const Select = styled(MuiSelect)`
  & .MuiSelect-select {
    padding-top: 8px;
    padding-bottom: 12px;
  }
`;

const UserSearch = (): React.ReactElement => {
  const {
    loading,
    users,
    totalUsers,
    errorMessage,
    onSearchChanged,
    pageSize,
    page,
    onRowsPerPageChanged,
    onPaginationChanged,
  } = useUserSearch();

  if (loading) {
    return <Spinner />;
  }

  if (errorMessage) {
    return <Typography variant="headingM">{errorMessage}</Typography>;
  }

  return (
    <Box
      justifyContent="center"
      margin="auto"
      flexDirection="column"
      display="flex"
      marginTop="spaceL"
      maxWidth="679px"
    >
      <Box
        marginBottom="spaceM"
        justifyContent="center"
        flexDirection="row"
        display="flex"
      >
        <Grid container>
          <Grid item xs={6}>
            <SearchField onChange={onSearchChanged} />
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="100%"
            xs={6}
          >
            <Box marginRight="spaceXS">Rows per page:</Box>
            <Select
              label="Rows per page:"
              variant="filled"
              value={pageSize}
              onChange={onRowsPerPageChanged}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing="spaceM">
        {users.map((user) => (
          <Grid xs={12} key={user.id} item>
            <UserTile
              id={user.id}
              name={formatName(user)}
              email={user.email}
              phone={user.phone}
            />
          </Grid>
        ))}
      </Grid>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-end"
        marginTop="spaceM"
      >
        <Pagination
          totalCount={totalUsers}
          page={page}
          pageSize={pageSize}
          onChange={onPaginationChanged}
        />
      </Box>
    </Box>
  );
};

export { UserSearch };
