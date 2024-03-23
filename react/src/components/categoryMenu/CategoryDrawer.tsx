import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';

interface CategoryDrawerProps {
  drawerWidth: number;
  desktopMenuOpen: boolean;
  mobileMenuOpen: boolean;
  handleMobileMenuClose: () => void;
  children: ReactElement;
}

const CategoryDrawer: React.FC<CategoryDrawerProps> = (props) => {
  const {
    drawerWidth,
    desktopMenuOpen,
    mobileMenuOpen,
    handleMobileMenuClose,
  } = props;

  const mediaMatches = useMediaQuery(useTheme().breakpoints.up('sm'));

  useEffect(() => {
    if (mediaMatches) {
      handleMobileMenuClose();
    }
  });

  return (
    <aside>
      {/* Desktop*/}
      <Drawer
        variant="persistent"
        anchor="left"
        open={desktopMenuOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: '#000 -6px 1px 20px 1px',
            border: 'none',
          },
        }}
      >
        {props.children}
      </Drawer>

      {/* Mobile*/}
      <Drawer
        variant="temporary"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {props.children}
      </Drawer>
    </aside>
  );
};

export default CategoryDrawer;
