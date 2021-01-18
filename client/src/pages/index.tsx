import React, { FC, lazy, Suspense, useState, ChangeEvent } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  CssBaseline,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Snackbar,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import {
  Folder as FolderIcon,
  FolderShared as FolderSharedIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import { useQuery, gql } from "@apollo/client";
import { errorVar } from "../cache";
import Header from "../components/Header";
import Login from "./Login";
import Page404 from "./404";
import FullPageLoading from "../components/FullPageLoading";

const Dashboard = lazy(() => import("./Dashboard"));
const Project = lazy(() => import("./Project"));
const Tasks = lazy(() => import("./Tasks"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(8),
    },
    navigation: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
    },
  })
);

const GET_AUTH_STATE = gql`
  query GetAuthState {
    auth @client
  }
`;

const GET_ERROR_STATE = gql`
  query GetErrorState {
    error @client
  }
`;

const Pages: FC = () => {
  const classes = useStyles();
  const {
    data: { auth },
    loading,
  } = useQuery(GET_AUTH_STATE);
  const {
    data: { error },
    loading: errorLoading,
  } = useQuery(GET_ERROR_STATE);
  const [value, setValue] = useState(0);

  const handleChange = (e: ChangeEvent<{}>, newValue: number) =>
    setValue(newValue);

  const handleClose = () =>
    errorVar({
      text: "",
      open: false,
    });

  return loading ? (
    <FullPageLoading />
  ) : (
    <>
      <Router>
        {auth.token ? (
          <CssBaseline>
            <Header />
            <Container className={classes.container} maxWidth={false}>
              <Suspense fallback={<LinearProgress />}>
                <Switch>
                  <Route exact path="/" component={Login} />
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/project/:id" component={Project} />
                  <Route exact path="/tasks" component={Tasks} />
                  <Route path="**" component={Page404} />
                </Switch>
              </Suspense>
            </Container>
            <BottomNavigation
              className={classes.navigation}
              onChange={handleChange}
              value={value}
              showLabels
            >
              <BottomNavigationAction
                component={Link}
                to="/dashboard"
                label="Проекты"
                icon={<FolderIcon />}
              />
              <BottomNavigationAction
                component={Link}
                to="/tasks"
                label="Задачи"
                icon={<FolderSharedIcon />}
              />
            </BottomNavigation>
          </CssBaseline>
        ) : (
          <Login />
        )}
      </Router>
      {!errorLoading && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={error.open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={error.text}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      )}
    </>
  );
};

export default Pages;
