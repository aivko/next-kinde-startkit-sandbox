import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import Information from '@/components/dashboard/information/Information';

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <Stack spacing={3} p={5}>
      <Grid container spacing={3}>
        <Information />
      </Grid>
    </Stack>
  );
}