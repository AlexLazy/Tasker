import React, { FC, useState, Fragment } from 'react';

import { Link } from 'react-router-dom';

import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER_PROJECTS, GET_LOCAL_CURRENT_USER } from '../gql/queries';
import { DELETE_PROJECT } from '../gql/mutations';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import CakeIcon from '@material-ui/icons/Cake';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteBtn: {
      marginLeft: 'auto'
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    progressBtn: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
      color: green[500]
    },
    link: {
      color: 'inherit',
      textDecoration: 'none'
    },
    usersWrapper: {
      display: 'flex'
    },
    priceWrapper: {
      display: 'flex',
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    avatar: {
      width: 20,
      height: 20,
      transform: 'scale(1.5)'
    },
    price: {
      marginLeft: theme.spacing(1)
    }
  })
);

export interface ProjectCardProps {
  id: number;
  title: string;
  users: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }[];
  tasks: {
    price: number;
    price_total: number;
  }[];
}

export const ProjectCard: FC<ProjectCardProps> = ({
  id,
  title,
  users,
  tasks
}) => {
  const classes = useStyles();
  const client = useApolloClient();
  const [isHover, setIsHover] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: localUser } = useQuery(GET_LOCAL_CURRENT_USER);
  const role = localUser && localUser.me && localUser.me.role;
  const [mutateDeleteProject, { loading: loadingDeleteProject }] = useMutation(
    DELETE_PROJECT,
    {
      variables: { id },
      refetchQueries: [
        {
          query: GET_USER_PROJECTS
        }
      ],
      onCompleted({ deleteProject }) {
        !deleteProject &&
          client.writeData({
            data: {
              error: {
                __typename: 'error',
                text: 'Такого проекта не существует',
                open: true
              }
            }
          });
      },
      onError(error) {
        client.writeData({
          data: {
            error: {
              __typename: 'error',
              text: error.message,
              open: true
            }
          }
        });
      }
    }
  );
  const { price, price_total } = tasks.reduce(
    (prev, cur) => ({
      price: prev.price + cur.price,
      price_total: prev.price_total + cur.price_total
    }),
    {
      price: 0,
      price_total: 0
    }
  );

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteProjectClose = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteProject = async () => {
    await mutateDeleteProject({ variables: { id } });
    !loadingDeleteProject && setIsDeleteOpen(false);
  };

  return (
    <Fragment>
      <Card
        raised={isHover}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <CardHeader
          avatar={
            <div className={classes.usersWrapper}>
              {users.map(({ id, name, email, avatar }) => (
                <Tooltip
                  key={id}
                  title={
                    <p>
                      <b>{name}</b>
                      <br />
                      {email}
                    </p>
                  }
                >
                  <Avatar className={classes.avatar} src={avatar} />
                </Tooltip>
              ))}
            </div>
          }
          action={
            <div className={classes.priceWrapper}>
              <Chip
                className={classes.price}
                size='small'
                label={price_total}
                avatar={
                  <Avatar>
                    <BusinessCenterIcon />
                  </Avatar>
                }
              />
              <Chip
                className={classes.price}
                size='small'
                color='primary'
                label={role === 'ADMIN' ? price_total - price : price}
                avatar={
                  <Avatar>
                    <CakeIcon />
                  </Avatar>
                }
              />
            </div>
          }
        />
        <Link className={classes.link} to={`/projects/${id}`}>
          <CardActionArea>
            <CardContent>
              <Typography variant='h5' component='h2'>
                {title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Link>
        <CardActions disableSpacing>
          <IconButton aria-label='Добавить пользователя к проекту'>
            <PersonAddIcon />
          </IconButton>
          <IconButton aria-label='Удалить пользователя с проекта'>
            <PersonAddDisabledIcon />
          </IconButton>
          <IconButton
            className={classes.deleteBtn}
            onClick={handleDelete}
            aria-label='Удалить проект'
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Dialog
        open={isDeleteOpen}
        onClose={handleDeleteProjectClose}
        aria-labelledby='delete-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Удалить проект?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteProjectClose} color='primary' autoFocus>
            Нет
          </Button>
          <div className={classes.wrapper}>
            <Button onClick={handleDeleteProject} color='primary'>
              Да
            </Button>
            {loadingDeleteProject && (
              <CircularProgress className={classes.progressBtn} size={24} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
