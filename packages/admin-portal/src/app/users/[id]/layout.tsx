'use client';

import { useParams } from 'next/navigation';
import { Grid } from '@neofinancial/morpheus-components';

import { UserSidebar } from '../../../features/user-sidebar/user-sidebar';
import { UserHeader } from '../../../features/user-header/user-header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();

  return (
    <Grid container>
      <Grid item xs={12}>
        <UserHeader userId={id} />
      </Grid>
      <Grid item xs={12} lg={3}>
        <UserSidebar userId={id} />
      </Grid>
      <Grid item xs={12} lg={9}>
        {children}
      </Grid>
    </Grid>
  );
}
