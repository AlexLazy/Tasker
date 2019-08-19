import React, { FC, Fragment, useState } from 'react';

import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { GET_USERS, GET_USER_PROJECTS } from '../../gql/queries';
import { ADD_USER_TO_PROJECT } from '../../gql/mutations';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

import CircleLoading from '../CircleLoading';
import { IUser } from './ProjectCard';

export interface ProjectCardUserAddProps {
  id: number;
  inProjectUsers: IUser[];
}

const ProjectCardUserAdd: FC<ProjectCardUserAddProps> = ({
  id,
  inProjectUsers
}) => {
  const client = useApolloClient();
  const [mutateAddUser] = useMutation(ADD_USER_TO_PROJECT, {
    refetchQueries: [
      {
        query: GET_USER_PROJECTS
      }
    ],
    onCompleted({ addUserToProject }) {
      !addUserToProject &&
        client.writeData({
          data: {
            error: {
              __typename: 'error',
              text: 'Произошла ошибка',
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
  });

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [idUserLoading, setIdUserLoading] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = async () => {
    setIsLoading(true);
    const { data } = await client.query<{ users: IUser[] }>({
      query: GET_USERS
    });

    const users = data.users.filter(
      ({ id }) =>
        !inProjectUsers.reduce(
          (prev, { id: inProjectId }) => prev || inProjectId === id,
          false
        )
    );

    setUsers(users);
    setIsLoading(false);
    setOpen(true);
  };

  const handleAddUser = (project_id: number, user_id: number) => async () => {
    setIdUserLoading(user_id);
    await mutateAddUser({ variables: { project_id, user_id } });
    setIdUserLoading(null);
    setOpen(false);
  };

  const handleCreateUser = () => {
    client.writeData({
      data: {
        isNewAccountOpen: true
      }
    });
    setOpen(false);
  };

  return (
    <Fragment>
      <CircleLoading size={24} isLoading={isLoading}>
        <IconButton
          aria-label='Добавить пользователя к проекту'
          onClick={handleOpen}
          disabled={isLoading}
        >
          <PersonAddIcon />
        </IconButton>
      </CircleLoading>
      <Dialog
        onClose={handleClose}
        aria-labelledby='simple-dialog-title'
        open={open}
      >
        <DialogTitle id='simple-dialog-title'>
          Добавить пользователя на проект
        </DialogTitle>
        <List>
          {!isLoading &&
            users.map(({ id: userId, email, avatar }) => (
              <CircleLoading
                key={userId}
                size={24}
                isLoading={idUserLoading === userId}
              >
                <ListItem
                  button
                  onClick={handleAddUser(id, userId)}
                  disabled={idUserLoading === userId}
                >
                  <ListItemAvatar>
                    <Avatar src={avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={email} />
                </ListItem>
              </CircleLoading>
            ))}
          <ListItem button onClick={handleCreateUser}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Добавить новый аккаунт' />
          </ListItem>
        </List>
      </Dialog>
    </Fragment>
  );
};
export default ProjectCardUserAdd;
