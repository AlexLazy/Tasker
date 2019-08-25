import React, { FC, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { GET_LOCAL_CURRENT_USER } from '../../gql/queries';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

import { Task } from '../Task/Task';
import ProjectCardPrice from '../ProjectCard/ProjectCardPrice';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer'
  },
  header: {
    display: 'flex'
  },
  content: {
    maxHeight: 200,
    overflow: 'hidden'
  }
});

interface TaskCardProps extends Task {
  onClick?(): void;
}

const taskStatus = (status: string) => {
  switch (status) {
    case 'CHECKS':
      return <Chip size='small' label='На проверке' color='secondary' />;
    case 'CLOSED':
      return <Chip size='small' label='Закрыта' />;
    default:
      return <Chip size='small' label='Открыта' color='primary' />;
  }
};

const TaskCard: FC<TaskCardProps> = ({
  content,
  price_total,
  price,
  status,
  updated_at,
  onClick
}) => {
  const classes = useStyles();
  const [isHover, setIsHover] = useState(false);
  const { data } = useQuery(GET_LOCAL_CURRENT_USER);
  const role = data && data.me && data.me.role;

  return (
    <Card
      className={classes.root}
      raised={isHover}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
    >
      <CardHeader
        className={classes.header}
        avatar={taskStatus(status)}
        action={
          <ProjectCardPrice
            role={role}
            price_total={price_total}
            price={price}
          />
        }
      />
      <CardContent
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <CardActions disableSpacing>
        <EditIcon fontSize='small' />
        <Typography variant='caption'>&nbsp;{updated_at}</Typography>
      </CardActions>
    </Card>
  );
};
export default TaskCard;
