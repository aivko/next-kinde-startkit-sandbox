import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, zIndex: 10000, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}