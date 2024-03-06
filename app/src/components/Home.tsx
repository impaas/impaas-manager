import AccountCircle from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import { ListItemButton, ListItemText, TextField } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';
import ProjectList from './ProjectList';
import UploadButton from './UploadButton';
import ScientiaButton from './ScientiaButton';
import { Grid } from '@mui/material';

const drawerWidth: number = 260;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
})

export default function Home({ activeAcct, handleLogout }: { activeAcct: any, handleLogout: () => void }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [assignmentName, setAssignmentName] = useState<string>();

  const [logMessages, setLogMessages] = useState('');

  const log = (message: string) => {
    setLogMessages(prevMessages => prevMessages + new Date().toLocaleString() + ': ' + message + '\n');
  };

  const [isLogOpen, setIsLogOpen] = useState(false);

  const handleLogClose = () => {
    setIsLogOpen(false);
    setLogMessages('');
  };

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleHelpOpen = () => {
    setIsHelpOpen(true);
  };

  const handleHelpClose = () => {
    setIsHelpOpen(false);
  };

  const [reload, setReload] = useState(false);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {assignmentName ?? "Dashboard"}
            </Typography>
            <div>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ paddingRight: '5px' }} />
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                  align="right"
                >
                  {activeAcct.username}
                </Typography>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openMenu}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
            </Toolbar>
            <Divider />
            <List component="nav">
              <ListItemButtonWithSelector itemName="Dashboard" setAssignmentName={setAssignmentName} />
            </List>
            <Divider />
            <Box sx={{ flexGrow: 1 }} />
            <Grid container direction="column" spacing={2}>
            <Grid item>
              {/* <ScientiaButton /> */}
            </Grid>
            <Grid item>
              <UploadButton onUploadStart={() => setIsLogOpen(true)} log={log} activeacc={activeAcct} reload={reload} setReload={setReload} />
            </Grid>
            </Grid>
            <IconButton onClick={handleHelpOpen} sx={{ marginLeft: 'auto' }}>
              <HelpOutlineIcon />
            </IconButton>
            <Dialog open={isHelpOpen} onClose={handleHelpClose}>
              <DialogTitle>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleHelpClose}
                  style={{ position: 'absolute', right: '25px', top: '10px' }}
                >
                  <CloseIcon />
                </IconButton>
                Configuration File
              </DialogTitle>
              <DialogContent>
                <Typography>
                  The YAML file can contain a list of projects, each with a list of groups, each with a list of shortcodes (members). Permission to create services (e.g. databases) and provision storage volumes may optionally be specified. <br />
                  Here is an example of the format:
                </Typography>
                <Typography fontFamily="monospace" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: "pre-wrap" }}>
                  {`
    projects:
      your-project:
        description: Your project description
        groups:
          1:
          - abc123
          - ...
          2:
          - def456
          - ...
      another-project:
        extras:
          - service
          - volume
        groups:
          33:
          - abc123
          - ...
    `}
                </Typography>
              </DialogContent>
            </Dialog>
          </div>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <ProjectList activeAcct={activeAcct} reload={reload}/>

          <Dialog open={isLogOpen} maxWidth="md" fullWidth>
            <DialogTitle fontWeight="bold" style={{ display: 'flex', alignItems: 'center' }}>
              Log
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleLogClose}
                style={{ position: 'absolute', right: '25px', top: '10px' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                multiline
                fullWidth
                variant="outlined"
                value={logMessages}
                InputProps={{
                  readOnly: true,
                  style: { color: '#0f0', fontFamily: 'monospace', fontSize: '1rem', backgroundColor: '#000' },
                }}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const ListItemButtonWithSelector = ({ setAssignmentName, itemName }: { setAssignmentName: (name: string) => void, itemName: string }) => {
  return (
    <ListItemButton onClick={() => setAssignmentName(itemName)}>
      <ListItemText primary={itemName} />
    </ListItemButton>
  )
}
