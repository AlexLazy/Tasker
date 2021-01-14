import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql, ApolloQueryResult } from "@apollo/client";
import { meVar } from "../../cache";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  CardActions,
  IconButton,
  Typography,
  CardActionArea,
  CardContent,
  Card,
  Tooltip,
  Avatar,
  Theme,
  createStyles,
  CardHeader,
} from "@material-ui/core";
import ProjectCardPrice from "./ProjectCardPrice";
import ProjectCardUsers from "./ProjectCardUsers";
import Confirm from "../Confirm";

const REMOVE_PROJECT = gql`
  mutation RemoveProject($id: ID!) {
    removeProject(id: $id) {
      message
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: "inherit",
      textDecoration: "none",
    },
    deleteBtn: {
      marginLeft: "auto",
    },
    header: {
      flexWrap: "wrap",
    },
    usersWrapper: {
      display: "flex",
      marginBottom: theme.spacing(2),
    },
    avatar: {
      width: 20,
      height: 20,
      transform: "scale(1.5)",
    },
  })
);

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface ProjectCardProps {
  id: number;
  authorId: number;
  title: string;
  users: IUser[];
  tasks: {
    price: string;
    priceTotal: string;
  }[];
  refetch(
    variables?: Partial<Record<string, any>> | undefined
  ): Promise<ApolloQueryResult<any>>;
}

const ProjectCard: FC<ProjectCardProps> = ({
  id,
  authorId,
  title,
  users,
  tasks,
  refetch,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [removeProject, { loading }] = useMutation(REMOVE_PROJECT);
  const { id: userId } = meVar();

  const { price, priceTotal } = tasks.reduce(
    (prev, cur) => ({
      price: prev.price + parseInt(cur.price),
      priceTotal: prev.priceTotal + parseInt(cur.priceTotal),
    }),
    {
      price: 0,
      priceTotal: 0,
    }
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteProject = async () => {
    await removeProject({ variables: { id } });
    await refetch();
    setOpen(false);
  };

  return (
    <Card
      raised={isHover}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardHeader
        className={classes.header}
        avatar={
          <div className={classes.usersWrapper}>
            {users.map(({ id, name, email, avatar }) => (
              <Tooltip
                key={id}
                title={
                  <Typography variant="body2">
                    <Typography variant="subtitle2">{name}</Typography>
                    {email}
                  </Typography>
                }
              >
                <Avatar className={classes.avatar} src={avatar} />
              </Tooltip>
            ))}
          </div>
        }
        action={
          <ProjectCardPrice
            owner={authorId === userId}
            priceTotal={priceTotal}
            price={price}
          />
        }
      />
      <Link className={classes.link} to={`/project/${id}`}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions disableSpacing>
        <ProjectCardUsers
          action="add"
          id={id}
          inProjectUsers={users}
          onComplete={() => refetch()}
          disabled={authorId !== userId}
        />
        <ProjectCardUsers
          action="remove"
          id={id}
          inProjectUsers={users}
          onComplete={() => refetch()}
          disabled={authorId !== userId}
        />
        <IconButton
          className={classes.deleteBtn}
          onClick={handleOpen}
          aria-label="Удалить проект"
          disabled={authorId !== userId}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
      <Confirm
        title="Удалить проект?"
        isLoading={loading}
        open={open}
        onClose={handleClose}
        onAccept={handleDeleteProject}
      />
    </Card>
  );
};
export default ProjectCard;
