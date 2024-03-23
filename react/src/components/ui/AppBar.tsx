import { styled } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

interface AppBarProps extends MuiAppBarProps {
  drawerWidth?: number;
  open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>((props) => ({
  transition: props.theme.transitions.create(['margin', 'width'], {
    easing: props.theme.transitions.easing.sharp,
    duration: props.theme.transitions.duration.leavingScreen,
  }),
  ...(props.open && {
    width: `calc(100% - ${props.drawerWidth}px)`,
    marginLeft: `${props.drawerWidth}px`,
    transition: props.theme.transitions.create(['margin', 'width'], {
      easing: props.theme.transitions.easing.easeOut,
      duration: props.theme.transitions.duration.enteringScreen,
    }),
  }),
}));
