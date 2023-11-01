import React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { AppBar } from '../AppBar';
import { Main } from '../Main';
import SideBar from '../../sidebar/Sidebar';

export const drawerWidth = 240;

const AppLayout: React.FC<{ children: any }> = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex' },
        flexDirection: { sm: 'column' },
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" type="div">
              <Typography variant="h6" noWrap>
                Shoppirest
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
        <SideBar
          drawerWidth={drawerWidth}
          isOpen={open}
          drawerCloseHandler={handleDrawerClose}
        />
        <Main open={open}>{props.children}</Main>
      </Box>
      <footer>Footer</footer>
    </Box>
  );
};

export default AppLayout;
