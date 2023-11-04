import React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { Main } from '../Main';
import SideBar from '../../sidebar/Sidebar';
import { DrawerHeader } from '../DrawerHeader';
import { AppBar } from '../AppBar';

export const drawerWidth = 240;

const AppLayout: React.FC<{ children: any }> = (props) => {
  const [desktopMenuOpen, setDesktopMenuOpen] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const mediaMatches = useMediaQuery(useTheme().breakpoints.up('sm'));

  const handleDesktopMenuOpen = () => {
    setDesktopMenuOpen(true);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
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
        <AppBar position="fixed" open={desktopMenuOpen && mediaMatches}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open desktop drawer"
              onClick={handleDesktopMenuOpen}
              edge="start"
              sx={{
                mr: 2,
                ...((desktopMenuOpen || !mediaMatches) && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open mobile drawer"
              onClick={handleMobileMenuOpen}
              edge="start"
              sx={{ mr: 2, ...(mediaMatches && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: 'aliceblue',
                  textShadow: '2px 3px 1px #000',
                }}
              >
                Shoppirest
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
        <SideBar
          drawerWidth={drawerWidth}
          desktopMenuOpen={desktopMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
          desktopMenuToggle={setDesktopMenuOpen}
          mobileMenuToggle={setMobileMenuOpen}
        />
        <Main open={desktopMenuOpen}>
          <DrawerHeader />
          {props.children}
        </Main>
      </Box>
      <footer>Footer</footer>
    </Box>
  );
};

export default AppLayout;
