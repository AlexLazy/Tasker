import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import TaskCard from "../TaskCard";
import { Task as TaskProps, TaskStatus } from "../Task/Task";

interface TaskTileProps {
  tasks: TaskProps[];
  onTaskCardClick(task: TaskProps): () => void;
}

const TaskTile: FC<TaskTileProps> = ({ tasks, onTaskCardClick }) => (
  <Grid container spacing={3}>
    {[...tasks]
      .sort((prev, curr) => (curr.status === TaskStatus.CLOSED ? 1 : -1))
      .sort((prev, curr) => (curr.status === TaskStatus.CHECKING ? 1 : -1))
      .map((task) => (
        <Grid item xl={3} lg={4} md={6} sm={12} xs={12} key={task.id}>
          <TaskCard {...task} onClick={onTaskCardClick({ ...task })} />
        </Grid>
      ))}
  </Grid>
);
export default TaskTile;
