import React, { FC, Fragment, useState } from 'react';

import { match } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECT } from '../gql/queries';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

import Task from '../components/Task';
import TaskCard from '../components/TaskCard';
import { Task as TaskProps } from '../components/Task/Task';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 1000
    }
  })
);

interface ProjectProps {
  match: match<{ id: string }>;
}

const Project: FC<ProjectProps> = ({ match }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<TaskProps | null>(null);
  const [isCreate, setIsCreate] = useState(false);
  const project_id = +match.params.id;
  const { data, loading, error } = useQuery(GET_PROJECT, {
    variables: { id: project_id }
  });

  if (error) return <p>ERROR</p>;

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
    setIsCreate(false);
    setOpen(true);
  };

  const handleCreate = () => {
    setIsCreate(true);
    setOpen(true);
  };

  return loading ? (
    <LinearProgress />
  ) : (
    <Fragment>
      <Typography variant='h4' component='h1' gutterBottom>
        {data.project.title}
      </Typography>
      <Grid container spacing={3}>
        {data.project &&
          data.project.tasks &&
          data.project.tasks.map((task: TaskProps) => (
            <Grid
              item
              xl={2}
              lg={3}
              md={4}
              sm={6}
              xs={12}
              key={task.id}
              onClick={handleOpen({ ...task })}
            >
              <TaskCard {...task} />
            </Grid>
          ))}
      </Grid>
      <Task
        project_id={project_id}
        task={task}
        open={open}
        isCreate={isCreate}
        onClose={() => setOpen(false)}
      />
      <Tooltip title='Создать задачу' placement='left'>
        <Fab
          color='secondary'
          aria-label='Создать задачу'
          className={classes.btn}
          onClick={handleCreate}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Fragment>
  );
};

export default Project;
