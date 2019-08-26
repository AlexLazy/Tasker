import React, { FC, Fragment, useState } from 'react';

import { REQUEST_ERROR, COMPLETE_ERROR } from '../../constants';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { GET_USER_PROJECTS, GET_PROJECT_AUTHOR } from '../../gql/queries';
import { REMOVE_USER_TO_PROJECT } from '../../gql/mutations';

import IconButton from '@material-ui/core/IconButton';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

import CircleLoading from '../CircleLoading';
import { IUser } from './ProjectCard';

export interface IAuthor {
  project: {
    author: {
      id: number;
    };
  };
}

export interface ProjectCardUserRemoveProps {
  id: number;
  inProjectUsers: IUser[];
}

const ProjectCardUserRemove: FC<ProjectCardUserRemoveProps> = ({
  id,
  inProjectUsers
}) => {
  const client = useApolloClient();
  const [mutateRemoveUser] = useMutation(REMOVE_USER_TO_PROJECT, {
    refetchQueries: [
      {
        query: GET_USER_PROJECTS
      }
    ],
    onCompleted({ removeUserFromProject }) {
      !removeUserFromProject && client.writeData(COMPLETE_ERROR);
    },
    onError(error) {
      client.writeData(REQUEST_ERROR(error));
    }
  });

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [idUserLoading, setIdUserLoading] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = async () => {
    setIsLoading(true);
    const { data } = await client.query<IAuthor>({
      variables: { id },
      query: GET_PROJECT_AUTHOR
    });

    const users = inProjectUsers.filter(
      ({ id }) => data.project.author.id !== id
    );

    setUsers(users);
    setIsLoading(false);
    setOpen(true);
  };

  const handleRemoveUser = (
    project_id: number,
    user_id: number
  ) => async () => {
    setIdUserLoading(user_id);
    await mutateRemoveUser({ variables: { project_id, user_id } });
    setIdUserLoading(null);
    setOpen(false);
  };

  return (
    <Fragment>
      <CircleLoading size={24} isLoading={isLoading}>
        <IconButton
          aria-label='Удалить пользователя с проекта'
          onClick={handleOpen}
          disabled={isLoading}
        >
          <PersonAddDisabledIcon />
        </IconButton>
      </CircleLoading>
      <Dialog
        onClose={handleClose}
        aria-labelledby='simple-dialog-title'
        open={open}
      >
        <DialogTitle id='simple-dialog-title'>
          {users.length
            ? 'Удалить пользователя с проекта'
            : 'Пользователи отсутствуют'}
        </DialogTitle>
        <List>
          {!isLoading &&
            users.map(({ id: userId, email, avatar }) => (
              <CircleLoading
                key={userId}
                size={32}
                isLoading={idUserLoading === userId}
              >
                <ListItem
                  button
                  onClick={handleRemoveUser(id, userId)}
                  disabled={idUserLoading === userId}
                >
                  <ListItemAvatar>
                    <Avatar src={avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={email} />
                </ListItem>
              </CircleLoading>
            ))}
        </List>
      </Dialog>
    </Fragment>
  );
};
export default ProjectCardUserRemove;
