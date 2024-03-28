import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import React, { ReactElement } from 'react';

interface CategoryDrawerProps {
  drawerWidth: number;
  filterOpen: boolean;
  handleFilterClose: () => void;
  children: ReactElement;
}

const FilterDrawer: React.FC<CategoryDrawerProps> = (props) => {
  const { drawerWidth, filterOpen, handleFilterClose } = props;

  const mediaMatches = useMediaQuery(useTheme().breakpoints.up('sm'));

  return (
    <aside>
      {/* Desktop*/}
      <Drawer
        open
        anchor="right"
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            padding: '96px 15px 20px',
            boxSizing: 'border-box',
            zIndex: 100,
          },
        }}
      >
        {props.children}
      </Drawer>

      {/* mobile*/}
      <Drawer
        variant="temporary"
        anchor="right"
        open={filterOpen}
        onClose={handleFilterClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            padding: '124px 15px 20px',
            boxSizing: 'border-box',
          },
        }}
      >
        {props.children}
      </Drawer>
    </aside>
  );
};

export default FilterDrawer;
