import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { Link } from 'react-router-dom';

import { AppBar } from '../AppBar';
import { Main } from '../Main';
import { CategoryMenu } from './../../categoryMenu/CategoryMenu';

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

  const desktopMenuHandlerClose = () => {
    setDesktopMenuOpen(false);
  };

  const mobileMenuHandlerClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex' },
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="fixed"
        drawerWidth={240}
        open={desktopMenuOpen && mediaMatches}
      >
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
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <CategoryMenu
          desktopMenuOpen={desktopMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
          handleDesktopMenuClose={desktopMenuHandlerClose}
          handleMobileMenuClose={mobileMenuHandlerClose}
        />
        <Main drawerWidth={240} open={desktopMenuOpen}>
          {props.children}
        </Main>
      </Box>
      <footer>Footer</footer>
    </Box>
  );
};

export default AppLayout;
