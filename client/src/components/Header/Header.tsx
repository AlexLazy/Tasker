import React, { FC, MouseEvent, useState } from "react";
import { GoogleLogout } from "react-google-login";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
} from "@material-ui/core";
import ExitToApp from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  logo: {
    flexGrow: 1,
  },
});

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me @client
  }
`;

const Header: FC = () => {
  const classes = useStyles();
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => window.location.reload();

  return loading ? (
    <LinearProgress />
  ) : (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.logo} variant="h6">
          Tasker
        </Typography>
        <Tooltip title={data.me.email}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar alt="Profile Picture" src={data.me.avatar} />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
            Проекты
          </MenuItem>
          <MenuItem component={Link} to="/tasks" onClick={handleClose}>
            Задачи
          </MenuItem>
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
            buttonText="logout"
            onLogoutSuccess={handleLogout}
            render={({ onClick }) => (
              <MenuItem onClick={onClick}>
                Выйти <ExitToApp />
              </MenuItem>
            )}
          />
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
