import React, { FC, MouseEvent } from 'react';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  logo: {
    flexGrow: 1
  }
});

export const GET_USER_INFO = gql`
  query GetUserInfo {
    me @client {
      avatar
      email
    }
  }
`;

const Header: FC = () => {
  const classes = useStyles();
  const client = useApolloClient();
  const { data } = useQuery(GET_USER_INFO);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    client.writeData({ data: { me: null, isLoggedIn: false } });
    localStorage.clear();
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography className={classes.logo} variant='h6'>
          Tasker
        </Typography>
        <Tooltip title={data.me.email}>
          <IconButton
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'
          >
            <Avatar alt='Profile Picture' src={data.me.avatar} />
          </IconButton>
        </Tooltip>
        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem component={Link} to='/' onClick={handleClose}>
            Проекты
          </MenuItem>
          <MenuItem component={Link} to='/tasks' onClick={handleClose}>
            Задачи
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            Выйти <ExitToApp />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
