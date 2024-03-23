import { styled } from '@mui/material';

interface MainProps {
  drawerWidth?: number;
  open?: boolean;
}

export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<MainProps>((props) => ({
  flexGrow: 1,
  background: '#edecea',
  paddingTop: props.theme.spacing(8),
  paddingBottom: props.theme.spacing(3),
  transition: props.theme.transitions.create('margin', {
    easing: props.theme.transitions.easing.sharp,
    duration: props.theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${props.drawerWidth}px`,
  ...(props.open && {
    transition: props.theme.transitions.create('margin', {
      easing: props.theme.transitions.easing.easeOut,
      duration: props.theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  '@media(max-width: 600px)': {
    marginLeft: 0,
  },
}));
