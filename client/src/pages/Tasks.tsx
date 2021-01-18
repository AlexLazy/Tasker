import React, { FC, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LinearProgress from "@material-ui/core/LinearProgress";
import TaskTile from "../components/TaskTile";
import Task from "../components/Task/";
import { Task as TaskProps } from "../components/Task/Task";
import RefetchProgress, { useRefetch } from "../components/RefetchProgress";

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
  const { data, loading, refetch, networkStatus } = useQuery(GET_TASKS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const isNotRefetch = useRefetch(loading, networkStatus);

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

  return isNotRefetch ? (
    <LinearProgress />
  ) : data?.tasks.length ? (
    <>
      <RefetchProgress networkStatus={networkStatus} />
      <TaskTile tasks={data.tasks} onTaskCardClick={handleOpen} />
      <Task task={task} open={open} refetch={refetch} onClose={handleClose} />
    </>
  ) : (
    <p>Нет задач.</p>
  );
};

export default Tasks;
