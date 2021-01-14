import React, { FC, Fragment, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LinearProgress from "@material-ui/core/LinearProgress";
import TaskTile from "../components/TaskTile";
import Task from "../components/Task/";
import { Task as TaskProps } from "../components/Task/Task";

const GET_TASKS = gql`
  query GetTasks {
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
`;

const Tasks: FC = () => {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<TaskProps | null>(null);
  const { data, loading, refetch } = useQuery(GET_TASKS, {
    fetchPolicy: "cache-and-network",
  });

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

  const handleClose = () => setOpen(false);

  return loading ? (
    <LinearProgress />
  ) : data?.tasks.length ? (
    <Fragment>
      <TaskTile tasks={data.tasks} onTaskCardClick={handleOpen} />
      <Task task={task} open={open} refetch={refetch} onClose={handleClose} />
    </Fragment>
  ) : (
    <p>Нет задач.</p>
  );
};

export default Tasks;
