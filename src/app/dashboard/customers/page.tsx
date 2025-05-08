import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CustomersLayout } from '@/components/dashboard/customer/customers-layout';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} p={5}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Clienti</Typography>
        </Stack>
      </Stack>
      <CustomersLayout />
    </Stack>
  );
}