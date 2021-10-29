import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/icons-material/Menu';
import { AuthContext } from '../providers/AuthContext';
import { logout } from '../services/firebase';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

export default function ButtonAppBar() {
  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Salmpled
          </Typography>
          {!!user ? (
            <Button onClick={logout} component={Link} to="/" variant="contained" color="primary"> Logout </Button>
          ) : (
            <Button component={Link} to="/login" variant="contained" color="primary"> Login </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}