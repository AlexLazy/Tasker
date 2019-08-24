import React, { FC } from 'react';

import Card from '@material-ui/core/Card';
import { Task } from '../Task/Task';

const TaskCard: FC<Task> = ({
  content,
  price_total,
  price,
  status,
  updated_at
}) => {
  return <Card>{content}</Card>;
};
export default TaskCard;
