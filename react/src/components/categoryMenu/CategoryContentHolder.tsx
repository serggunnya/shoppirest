import { ChevronLeft } from '@mui/icons-material';
import { Divider, IconButton, Typography } from '@mui/material';

import { ReactElement } from 'react';
import { DrawerHeader } from '../ui/DrawerHeader';

interface CategoryContentHolderProps {
  handleDesktopMenuClose: () => void;
  children: ReactElement;
}

const CategoryContentHolder: React.FC<CategoryContentHolderProps> = (props) => {
  return (
    <>
      <DrawerHeader
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#8BC34A',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 800,
            fontSize: '2rem',
            color: '#fff',
            margin: 0,
          }}
        >
          Каталог
        </Typography>
        <IconButton onClick={props.handleDesktopMenuClose}>
          <ChevronLeft sx={{ color: '#fff' }} />
        </IconButton>
      </DrawerHeader>
      <Divider />
      {props.children}
    </>
  );
};

export default CategoryContentHolder;
