import React, { FC, Fragment, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { GET_USER_TASKS } from '../gql/queries';

import LinearProgress from '@material-ui/core/LinearProgress';

import Task from '../components/Task';
import TaskTile from '../components/TaskTile';
import { Task as TaskProps } from '../components/Task/Task';

interface Project {
  tasks: TaskProps[];
}

const Tasks: FC = () => {
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_USER_TASKS);
  const [task, setTask] = useState<TaskProps | null>(null);
  if (error) return <p>ERROR</p>;

  const { tasks } =
    !loading &&
    data.me &&
    data.me.projects &&
    data.me.projects
      .filter(({ tasks }: { tasks: TaskProps[] }) => tasks.length)
      .reduce(
        (acc: Project, curr: Project) => {
          acc.tasks = [...acc.tasks, ...curr.tasks];
          return acc;
        },
        { tasks: [] }
      );

  const handleOpen = ({
    id,
    content,
    price_total,
    price,
    status
  }: TaskProps) => () => {
    setTask({
      id,
      content,
      price_total,
      price,
      status
    });
    setOpen(true);
  };
  return loading || !tasks ? (
    <LinearProgress />
  ) : (
    <Fragment>
      <TaskTile tasks={tasks} onTaskCardClick={handleOpen} />
      <Task
        task={task}
        open={open}
        isCreate={false}
        onClose={() => setOpen(false)}
      />
    </Fragment>
  );
};

export default Tasks;
