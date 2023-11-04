import React, { useEffect } from 'react';
import {
  Drawer,
  Divider,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

import { DrawerHeader } from '../ui/DrawerHeader';
import CategoriesList from '../categoriesList/CategoriesList';

interface SidebarPops {
  drawerWidth: number;
  desktopMenuOpen: boolean;
  mobileMenuOpen: boolean;
  desktopMenuToggle: (set: boolean) => void;
  mobileMenuToggle: (set: boolean) => void;
}

const SideBar: React.FC<SidebarPops> = (props) => {
  const {
    drawerWidth,
    desktopMenuOpen,
    mobileMenuOpen,
    desktopMenuToggle,
    mobileMenuToggle,
  } = props;

  const mediaMatches = useMediaQuery(useTheme().breakpoints.up('sm'));

  useEffect(() => {
    if (mediaMatches) {
      mobileMenuToggle(false);
    }
  });

  const drawerContent = (
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
        <IconButton onClick={() => desktopMenuToggle(false)}>
          <ChevronLeft sx={{ color: '#fff' }} />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <CategoriesList />
    </>
  );

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
        {drawerContent}
      </Drawer>

      {/* Mobile*/}
      <Drawer
        variant="temporary"
        open={mobileMenuOpen}
        onClose={() => mobileMenuToggle(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    </aside>
  );
};

export default SideBar;
