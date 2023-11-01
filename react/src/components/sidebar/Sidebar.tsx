import React from 'react';
import { Drawer, Divider, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@emotion/react';

import { DrawerHeader } from '../ui/DrawerHeader';
import CategoriesList from '../categoriesList/CategoriesList';

interface SidebarPops {
  drawerWidth: number;
  isOpen: boolean;
  drawerCloseHandler: () => void;
}

const SideBar: React.FC<SidebarPops> = (props) => {
  const { drawerWidth, isOpen, drawerCloseHandler } = props;
  const theme: any = useTheme();

  const drawerContent = (
    <>
      <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" gutterBottom>
          Каталог
        </Typography>
        <IconButton onClick={drawerCloseHandler}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
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
        open={isOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile*/}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={drawerCloseHandler}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    </aside>
  );
};

export default SideBar;
