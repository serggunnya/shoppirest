import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useGetAllCategoriesQuery } from 'store/slices/productSlice';
import { Box, Button, Drawer } from '@mui/material';
import { useTheme } from '@emotion/react';
import { DrawerHeader } from '../DrawerHeader';
import { AppBar } from '../AppBar';
import { Main } from '../Main';
import {
  Link,
  Outlet,
  Route,
  Routes,
  createSearchParams,
  useNavigate,
} from 'react-router-dom';

export const drawerWidth = 240;

const AppLayout: React.FC<{ children: any }> = (props) => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({});

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const theme: any = useTheme();

  const categoriesList = (
    <div>
      <Button onClick={() => navigate('/')}>Home</Button>
      <Button onClick={() => navigate('/login')}>login</Button>
      {isLoading ? (
        'загрузка'
      ) : (
        <List>
          {data.map((p: any) => (
            <ListItem key={p.id} disablePadding>
              <ListItemButton
                onClick={() =>
                  navigate({
                    pathname: '/products',
                    search: createSearchParams({
                      page: '1',
                      cat: p.id,
                    }).toString(),
                  })
                }
              >
                <ListItemText primary={p.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );

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
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography variant="h5" gutterBottom>
              Категории
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          {categoriesList}
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {props.children}
        </Main>
      </Box>
      <footer>Footer</footer>
    </Box>
  );
};

export default AppLayout;

/*


*/
