import React, { Fragment, FC } from 'react';

import { Switch, Route, Link } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';

import { Header } from '../components';

import Page404 from './404';
import Projects from './Projects';
import Tasks from './Tasks';
import Project from './Project';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    navigation: {
      marginTop: 'auto'
    }
  })
);

const Pages: FC = () => {
  const classes = useStyles();
  return (
    <CssBaseline>
      <Fragment>
        <Header />
        <Container className={classes.container} maxWidth={false}>
          <Switch>
            <Route exact path='/' component={Projects} />
            <Route exact path='/projects/:id' component={Project} />
            <Route exact path='/tasks' component={Tasks} />
            <Route path='**' component={Page404} />
          </Switch>
        </Container>
        <BottomNavigation className={classes.navigation} showLabels>
          <BottomNavigationAction
            component={Link}
            to='/'
            label='Проекты'
            icon={<FolderIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to='/tasks'
            label='Задачи'
            icon={<FolderSharedIcon />}
          />
        </BottomNavigation>
      </Fragment>
    </CssBaseline>
  );
};

export default Pages;
