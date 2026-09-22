import { ListRow, Typography } from '@neofinancial/morpheus-components';

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}): React.ReactElement => (
  <ListRow
    background="transparent"
    primaryText={
      <Typography variant="bodyLongL" color="contentSubdued">
        {label}
      </Typography>
    }
    trailing={<Typography variant="bodyLongL">{value} </Typography>}
  />
);

export { DetailRow };
