import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { AgencyCreateForm } from '@/components/dashboard/agency/agency-create-form';

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <Stack spacing={3} p={5}>
      <Grid container spacing={3}>
        <AgencyCreateForm />
      </Grid>
    </Stack>
  );
}
