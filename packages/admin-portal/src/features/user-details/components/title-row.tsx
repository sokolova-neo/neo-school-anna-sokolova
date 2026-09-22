import { Edit } from '@neofinancial/morpheus-icons';
import {
  IconButton,
  Grid,
  Box,
  Typography,
  Divider,
} from '@neofinancial/morpheus-components';

const TitleRow = ({
  label,
  action,
}: {
  label: string;
  action?: () => void;
}): React.ReactElement => (
  <Grid container display="flex">
    <Grid item xs={6}>
      <Box paddingTop="spaceL">
        <Typography variant="headingXS">{label}</Typography>
      </Box>
    </Grid>
    <Grid item xs={6} textAlign="right">
      <Box paddingTop="spaceL">
        <IconButton size="micro" variant="ghost" onClick={action}>
          <Edit />
        </IconButton>
      </Box>
    </Grid>
    <Grid item xs={12} paddingBottom="spaceM">
      <Divider />
    </Grid>
  </Grid>
);

export { TitleRow };
