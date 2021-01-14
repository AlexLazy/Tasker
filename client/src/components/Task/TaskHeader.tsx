import React, { FC, useState, ChangeEvent, Fragment } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Select,
  InputLabel,
} from "@material-ui/core";
import { Close as CloseIcon, Delete as DeleteIcon } from "@material-ui/icons";
import CircleLoading from "../CircleLoading";
import Confirm from "../Confirm";
import { TaskStatus, Task, NewTask } from "./Task";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginBottom: theme.spacing(3),
    },
    toolbar: {
      display: "flex",
      justifyContent: "flex-end",
    },
    label: {
      color: "#fff !important",
    },
    input: {
      marginLeft: theme.spacing(2),
      "& input, & label": {
        color: "#fff !important",
      },
      "& .MuiInput-underline:before, & .MuiInput-underline:after": {
        borderBottomColor: "#fff !important",
      },
    },
    selectBorder: {
      "&::before, &::after": {
        borderBottomColor: "#fff !important",
      },
    },
    select: {
      color: "#fff",
    },
    icon: {
      fill: "#fff",
    },
    btn: {
      marginLeft: theme.spacing(2),
    },
    form: {
      marginLeft: "auto",
    },
  })
);

interface TaskHeaderProps {
  owner: boolean;
  task: Task | null;
  changeLoading: boolean;
  deleteLoading: boolean;
  onSave(task: Task | NewTask): void;
  onDelete(task: Task | NewTask): void;
  onClose(): void;
}

const TaskHeader: FC<TaskHeaderProps> = ({
  owner,
  task,
  changeLoading,
  deleteLoading,
  onSave,
  onDelete,
  onClose,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const initialTask: Task | NewTask = task
    ? task
    : { priceTotal: 0, price: 0, status: TaskStatus.OPENED, content: "" };
  const [taskState, setTaskState] = useState<Task | NewTask>(initialTask);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleStatus = (
    e: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => setTaskState({ ...taskState, status: e.target.value as TaskStatus });
  const handlePriceTotal = (e: ChangeEvent<HTMLInputElement>) =>
    setTaskState({ ...taskState, priceTotal: parseInt(e.target.value) });
  const handlePrice = (e: ChangeEvent<HTMLInputElement>) =>
    setTaskState({ ...taskState, price: parseInt(e.target.value) });
  const handleSave = (task: Task | NewTask) => () => onSave(task);
  const handleDelete = (task: Task | NewTask) => () => onDelete(task);

  return (
    <AppBar className={classes.header} position="static">
      <Toolbar className={classes.toolbar}>
        {owner && task?.id && (
          <Fragment>
            <IconButton aria-label="Удалить задачу" onClick={handleOpen}>
              <DeleteIcon color="error" />
            </IconButton>
            <Confirm
              title="Удалить задачу?"
              isLoading={deleteLoading}
              open={open}
              onClose={handleClose}
              onAccept={handleDelete(task)}
            />
          </Fragment>
        )}
        {!(!owner && task?.status === TaskStatus.CLOSED) && (
          <FormControl className={classes.form}>
            <InputLabel className={classes.label} htmlFor="task-status">
              Статус
            </InputLabel>
            <Select
              className={classes.selectBorder}
              classes={{
                select: classes.select,
                icon: classes.icon,
              }}
              value={taskState.status}
              onChange={handleStatus}
              inputProps={{
                name: "status",
                id: "task-status",
              }}
              disabled={!task}
            >
              <MenuItem value={TaskStatus.OPENED}>Открыта</MenuItem>
              <MenuItem value={TaskStatus.CHECKING}>На проверке</MenuItem>
              {owner && <MenuItem value={TaskStatus.CLOSED}>Закрыта</MenuItem>}
            </Select>
          </FormControl>
        )}
        {owner && (
          <Fragment>
            <TextField
              classes={{
                root: classes.input,
              }}
              label="Стоимость задачи"
              type="number"
              value={taskState.priceTotal}
              onChange={handlePriceTotal}
            />
            <TextField
              classes={{
                root: classes.input,
              }}
              label="Стоимость работы"
              type="number"
              value={taskState.price}
              onChange={handlePrice}
            />
          </Fragment>
        )}
        {!(!owner && task?.status === TaskStatus.CLOSED) && (
          <CircleLoading
            className={classes.btn}
            size={24}
            isLoading={changeLoading}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleSave(taskState)}
              disabled={changeLoading}
            >
              {task ? "Обновить" : "Сохранить"}
            </Button>
          </CircleLoading>
        )}
        <IconButton
          className={classes.btn}
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
export default TaskHeader;
