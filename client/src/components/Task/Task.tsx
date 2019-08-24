import React, { FC, useState, forwardRef, useEffect, ChangeEvent } from 'react';

import { REQUEST_ERROR, COMPLETE_ERROR } from '../../constants';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { GET_PROJECT } from '../../gql/queries';
import { ADD_TASK, UPDATE_TASK } from '../../gql/mutations';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import Editor from '../Editor';
import CircleLoading from '../CircleLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginBottom: theme.spacing(3)
    },
    container: {
      height: '100%'
    },
    label: {
      color: '#fff !important'
    },
    input: {
      marginLeft: theme.spacing(2),
      '& input, & label': {
        color: '#fff !important'
      },
      '& .MuiInput-underline:before, & .MuiInput-underline:after': {
        borderBottomColor: '#fff !important'
      }
    },
    selectBorder: {
      '&::before, &::after': {
        borderBottomColor: '#fff !important'
      }
    },
    select: {
      color: '#fff'
    },
    icon: {
      fill: '#fff'
    },
    btn: {
      marginLeft: theme.spacing(4)
    },
    btnGreen: {
      color: green[500]
    },
    close: {
      marginRight: 'auto'
    }
  })
);

const Transition = forwardRef<unknown, TransitionProps>((props, ref) => (
  <Slide direction='up' ref={ref} {...props} />
));

export interface Task {
  id?: number;
  content: string;
  price_total: number;
  price: number;
  status: 'OPEN' | 'CHECKS' | 'CLOSED';
  updated_at?: Date;
}

interface TaskProps {
  project_id: number;
  task: Task | null;
  open: boolean;
  isCreate: boolean;
  onClose(): void;
}

const Task: FC<TaskProps> = ({ project_id, task, open, isCreate, onClose }) => {
  const client = useApolloClient();
  const [mutateAddTask] = useMutation(ADD_TASK, {
    refetchQueries: [
      {
        query: GET_PROJECT,
        variables: { id: project_id }
      }
    ],
    onCompleted({ createTask }) {
      createTask && localStorage.removeItem('task');
      client.writeData({
        data: {
          error: {
            __typename: 'error',
            text: createTask
              ? `Задача успешно добавлена в проект ${createTask.project.title}.`
              : 'Произошла ошибка',
            open: true
          }
        }
      });
    },
    onError(error) {
      client.writeData(REQUEST_ERROR(error));
    }
  });
  const [mutateUpdateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      {
        query: GET_PROJECT,
        variables: { id: project_id }
      }
    ],
    onCompleted({ updateTask }) {
      updateTask
        ? localStorage.removeItem('task')
        : client.writeData(COMPLETE_ERROR);
    },
    onError(error) {
      client.writeData(REQUEST_ERROR(error));
    }
  });

  const classes = useStyles();
  const [height, setHeight] = useState<number | undefined>();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stateTask, setStateTask] = useState<Task>({
    id: undefined,
    content: '',
    price_total: 0,
    price: 0,
    status: 'OPEN'
  });
  const { id, content, price_total, price, status } = stateTask;
  const localTask =
    localStorage.getItem('task') &&
    JSON.parse(localStorage.getItem('task') || '');

  const fillTask = (task: Task) => {
    setStateTask({
      id: task.id || undefined,
      content: task.content || '',
      price_total: task.price_total || 0,
      price: task.price || 0,
      status: task.status || 'OPEN'
    });
  };

  const handleTaskField = (name: string, value: string | number) => {
    isCreate &&
      localStorage.setItem(
        'task',
        JSON.stringify({
          ...stateTask,
          [name]: value
        })
      );
    setStateTask({
      ...stateTask,
      [name]: value
    });
  };

  useEffect(() => {
    if (isCreate) {
      setDisabled(false);
      localTask && fillTask(localTask);
    } else {
      task && fillTask(task);
    }
    return () => {
      setDisabled(true);
      setStateTask({
        id: undefined,
        content: '',
        price_total: 0,
        price: 0,
        status: 'OPEN'
      });
    };
  }, [open]);

  const handleContent = (content: string) => {
    handleTaskField('content', content);
  };

  const handlePriceTotal = (e: ChangeEvent<HTMLInputElement>) =>
    handleTaskField('price_total', parseInt(e.target.value));
  const handlePrice = (e: ChangeEvent<HTMLInputElement>) =>
    handleTaskField('price', parseInt(e.target.value));

  const handleStatus = (
    e: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => handleTaskField('status', '' + e.target.value);

  const handleSave = async () => {
    setLoading(true);
    isCreate
      ? await mutateAddTask({
          variables: { project_id, content, price_total, price }
        })
      : await mutateUpdateTask({
          variables: { id, content, price_total, price, status }
        });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      disableEnforceFocus={true}
    >
      <AppBar className={classes.header} position='static'>
        <Toolbar>
          <IconButton
            className={classes.close}
            edge='start'
            color='inherit'
            onClick={onClose}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <FormControl>
            <InputLabel className={classes.label} htmlFor='task-status'>
              Статус
            </InputLabel>
            <Select
              className={classes.selectBorder}
              classes={{
                select: classes.select,
                icon: classes.icon
              }}
              value={status}
              onChange={handleStatus}
              inputProps={{
                name: 'status',
                id: 'task-status'
              }}
              disabled={disabled || isCreate}
            >
              <MenuItem value='OPEN'>Открыта</MenuItem>
              <MenuItem value='CHECKS'>На проверке</MenuItem>
              <MenuItem value='CLOSED'>Закрыта</MenuItem>
            </Select>
          </FormControl>
          <TextField
            classes={{
              root: classes.input
            }}
            label='Стоимость задачи'
            color='#fff'
            value={price_total}
            onChange={handlePriceTotal}
            disabled={disabled}
          />
          <TextField
            classes={{
              root: classes.input
            }}
            label='Стоимость работы'
            color='#fff'
            value={price}
            onChange={handlePrice}
            disabled={disabled}
          />
          {disabled ? (
            <Button
              variant='outlined'
              className={classes.btn}
              color='inherit'
              onClick={() => setDisabled(false)}
            >
              Редактировать
            </Button>
          ) : (
            <CircleLoading
              className={classes.btn}
              size={24}
              isLoading={loading}
            >
              <Button
                classes={{
                  outlined: classes.btnGreen
                }}
                variant='outlined'
                color='inherit'
                onClick={handleSave}
                disabled={loading}
              >
                Сохранить
              </Button>
            </CircleLoading>
          )}
        </Toolbar>
      </AppBar>
      <Container
        className={classes.container}
        ref={(node: HTMLDivElement) => {
          node && setHeight(node.clientHeight);
        }}
      >
        {height ? (
          <Editor
            height={height}
            onEditorChange={handleContent}
            content={content}
            disabled={disabled}
          />
        ) : (
          <p>Загрузка</p>
        )}
      </Container>
    </Dialog>
  );
};
export default Task;
