import React, { FC, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ProjectCardPrice from "../ProjectCard/ProjectCardPrice";
import { Task, TaskStatus } from "../Task/Task";
import { meVar } from "../../cache";

const useStyles = makeStyles({
  root: {
    cursor: "pointer",
  },
  header: {
    display: "flex",
  },
  content: {
    maxHeight: 200,
    overflow: "hidden",
  },
});

interface TaskCardProps extends Task {
  onClick?(): void;
}

const taskStatus = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.CHECKING:
      return <Chip size="small" label="На проверке" color="secondary" />;
    case TaskStatus.CLOSED:
      return <Chip size="small" label="Закрыта" />;
    default:
      return <Chip size="small" label="Открыта" color="primary" />;
  }
};

const TaskCard: FC<TaskCardProps> = ({
  authorId,
  content,
  priceTotal,
  price,
  status,
  updatedAt,
  onClick,
}) => {
  const classes = useStyles();
  const [isHover, setIsHover] = useState(false);
  const owner = meVar().id === authorId;
  const updatedDate =
    updatedAt &&
    new Intl.DateTimeFormat("ru", {
      hour: "numeric",
      minute: "numeric",
      weekday: "narrow",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(updatedAt));

  const handleEnter = () => setIsHover(true);
  const handleLeave = () => setIsHover(false);

  return (
    <Card
      className={classes.root}
      raised={isHover}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      <CardHeader
        className={classes.header}
        avatar={taskStatus(status)}
        action={
          <ProjectCardPrice
            owner={owner}
            priceTotal={priceTotal}
            price={price}
          />
        }
      />
      <CardContent
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
      <CardActions disableSpacing>
        <EditIcon fontSize="small" />
        <Typography variant="caption">&nbsp;{updatedDate}</Typography>
      </CardActions>
    </Card>
  );
};
export default TaskCard;
