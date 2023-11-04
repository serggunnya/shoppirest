import React from 'react';
import { Skeleton, Stack } from '@mui/material';

const CategoriesSkeleton: React.FC = (props) => {
  return (
    <Stack spacing={1} padding={2}>
      <Skeleton variant="rectangular" width={'100%'} height={40} />
      <Skeleton variant="rectangular" width={'100%'} height={40} />
      <Skeleton variant="rectangular" width={'100%'} height={40} />
      <Skeleton variant="rectangular" width={'100%'} height={40} />
      <Skeleton variant="rectangular" width={'100%'} height={40} />
    </Stack>
  );
};

export default CategoriesSkeleton;
