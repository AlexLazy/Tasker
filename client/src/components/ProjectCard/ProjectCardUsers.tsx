import React, { FC, Fragment, useState } from "react";
import { useApolloClient, gql } from "@apollo/client";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import {
  PersonAdd as PersonAddIcon,
  PersonAddDisabled as PersonAddDisabledIcon,
} from "@material-ui/icons";
import { meVar } from "../../cache";
import CircleLoading from "../CircleLoading";
import { IUser } from "./ProjectCard";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      avatar
    }
  }
`;

const ADD_USER = gql`
  mutation AddUserToProject($projectId: ID!, $userId: ID!) {
    addUserToProject(projectId: $projectId, userId: $userId) {
      project {
        id
      }
    }
  }
`;

const REMOVE_USER = gql`
  mutation RemoveUserFromProject($projectId: ID!, $userId: ID!) {
    removeUserFromProject(projectId: $projectId, userId: $userId) {
      project {
        id
      }
    }
  }
`;

export interface ProjectCardUsersProps {
  id: number;
  inProjectUsers: IUser[];
  action: "add" | "remove";
  disabled: boolean;
  onComplete(): void;
}

const ProjectCardUsers: FC<ProjectCardUsersProps> = ({
  id,
  inProjectUsers,
  action,
  disabled,
  onComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const client = useApolloClient();

  const handleClose = () => setOpen(false);
  const handleOpen = async () => {
    setLoading(true);
    const me = meVar();
    let usersByAction;
    if (action === "add") {
      const { data } = await client.query({
        query: GET_USERS,
      });
      const { users: allUsers } = data;

      usersByAction = allUsers.filter(
        ({ id }: { id: number }) =>
          inProjectUsers.filter((user: IUser) => {
            return user.id === id;
          }).length === 0
      );
    } else {
      usersByAction = inProjectUsers.filter((user: IUser) => user.id !== me.id);
    }
    setUsers(usersByAction);
    setLoading(false);
    setOpen(true);
  };

  const handleUser = (projectId: number, userId: number) => async () => {
    setLoading(true);
    action === "add"
      ? await client.mutate({
          mutation: ADD_USER,
          variables: { projectId, userId },
        })
      : await client.mutate({
          mutation: REMOVE_USER,
          variables: { projectId, userId },
        });
    setLoading(false);
    setOpen(false);
    onComplete();
  };

  return (
    <Fragment>
      <CircleLoading size={24} isLoading={loading}>
        <IconButton
          aria-label={
            action === "add"
              ? "Добавить пользователя на проект"
              : "Удалить пользователя с проекта"
          }
          disabled={disabled}
          onClick={handleOpen}
        >
          {action === "add" ? <PersonAddIcon /> : <PersonAddDisabledIcon />}
        </IconButton>
      </CircleLoading>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">
          {!users.length
            ? "Пользователи отсутствуют"
            : action === "add"
            ? "Добавить пользователя на проект"
            : "Удалить пользователя с проекта"}
        </DialogTitle>
        <CircleLoading size={32} isLoading={loading}>
          <List>
            {users.map(({ id: userId, email, avatar }) => (
              <ListItem
                key={userId}
                button
                onClick={handleUser(id, userId)}
                disabled={loading}
              >
                <ListItemAvatar>
                  <Avatar src={avatar} />
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItem>
            ))}
          </List>
        </CircleLoading>
      </Dialog>
    </Fragment>
  );
};
export default ProjectCardUsers;
