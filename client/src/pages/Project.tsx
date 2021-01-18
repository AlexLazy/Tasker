import React, { FC, useState } from "react";
import { match } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography, Fab, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Task from "../components/Task";
import TaskTile from "../components/TaskTile";
import { Task as TaskProps } from "../components/Task/Task";
import RefetchProgress, { useRefetch } from "../components/RefetchProgress";
import { meVar } from "../cache";

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      authorId
      title
      tasks {
        id
        authorId
        content
        priceTotal
        price
        status
        updatedAt
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 1000,
    },
  })
);

interface ProjectProps {
  match: match<{ id: string }>;
}

const Project: FC<ProjectProps> = ({ match }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<TaskProps | null>(null);

  const projectId = +match.params.id;

  const { data, loading, refetch, networkStatus } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });
  const isNotRefetch = useRefetch(loading, networkStatus);

  const me = meVar();

  const project = data?.project;
  const tasks = project?.tasks ?? [];

  const handleOpen = ({
    id,
    authorId,
    content,
    priceTotal,
    price,
    status,
  }: TaskProps) => () => {
    setTask({
      id,
      authorId,
      content,
      priceTotal,
      price,
      status,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setTask(null);
    setOpen(false);
  };

  const handleCreate = () => {
    setOpen(true);
  };

  return isNotRefetch ? (
    <LinearProgress />
  ) : (
    <>
      <RefetchProgress networkStatus={networkStatus} />
      <Typography variant="h4" component="h1" gutterBottom>
        {project?.title}
      </Typography>
      {tasks.length ? (
        <TaskTile tasks={tasks} onTaskCardClick={handleOpen} />
      ) : (
        <p>Нет задач.</p>
      )}
      <Task
        projectId={projectId}
        task={task}
        open={open}
        refetch={refetch}
        onClose={handleClose}
      />
      {data?.project?.authorId === me.id && (
        <Tooltip title="Создать задачу" placement="left">
          <Fab
            color="secondary"
            aria-label="Создать задачу"
            className={classes.btn}
            onClick={handleCreate}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
    </>
  );
};

export default Project;
