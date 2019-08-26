import React, { FC, useState, forwardRef, useEffect, ChangeEvent } from 'react';

import { REQUEST_ERROR, COMPLETE_ERROR } from '../../constants';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import {
  GET_USER_PROJECTS,
  GET_PROJECT,
  GET_USER_TASKS
} from '../../gql/queries';
import { ADD_TASK, UPDATE_TASK, DELETE_TASK } from '../../gql/mutations';

import { makeStyles } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import Container from '@material-ui/core/Container';

import Editor from '../Editor';
import TaskHeader from './TaskHeader';

const useStyles = makeStyles({
  container: {
    height: '100%'
  }
});

const Transition = forwardRef<unknown, TransitionProps>((props, ref) => (
  <Slide direction='up' ref={ref} {...props} />
));

export interface Task {
  id?: number;
  content: string;
  price_total: string;
  price: string;
  status: 'OPEN' | 'CHECKS' | 'CLOSED';
  updated_at?: Date;
}

interface TaskProps {
  project_id?: number;
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
      },
      {
        query: GET_USER_TASKS
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
        query: GET_USER_PROJECTS
      },
      {
        query: GET_USER_TASKS
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

  const deleteQuery = project_id
    ? { query: GET_PROJECT, variables: { id: project_id } }
    : { query: GET_USER_PROJECTS };
  const [mutateDeleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [
      deleteQuery,
      {
        query: GET_USER_TASKS
      }
    ],
    onCompleted({ deleteTask }) {
      !deleteTask && client.writeData(COMPLETE_ERROR);
    },
    onError(error) {
      client.writeData(REQUEST_ERROR(error));
    }
  });

  const classes = useStyles();
  const [height, setHeight] = useState<number | undefined>();
  const [disabled, setDisabled] = useState(true);
  const [changeLoading, setChangeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stateTask, setStateTask] = useState<Task>({
    id: undefined,
    content: '',
    price_total: '0',
    price: '0',
    status: 'OPEN'
  });
  const { id, content, price_total, price, status } = stateTask;
  const localTask =
    localStorage.getItem('task') &&
    JSON.parse(localStorage.getItem('task') || '');

  const fillTask = (task: Task) =>
    setStateTask({
      id: task.id || undefined,
      content: task.content || '',
      price_total: task.price_total || '0',
      price: task.price || '0',
      status: task.status || 'OPEN'
    });

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
        price_total: '0',
        price: '0',
        status: 'OPEN'
      });
    };
  }, [open]);

  const handleContent = (content: string) => {
    handleTaskField('content', content);
  };

  const handlePriceTotal = (e: ChangeEvent<HTMLInputElement>) => {
    handleTaskField('price_total', e.target.value);
  };
  const handlePrice = (e: ChangeEvent<HTMLInputElement>) =>
    handleTaskField('price', e.target.value);

  const handleStatus = (
    e: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => handleTaskField('status', '' + e.target.value);

  const handleSave = async () => {
    setChangeLoading(true);
    isCreate
      ? await mutateAddTask({
          variables: {
            project_id,
            content,
            price_total: parseInt(price_total) || '0',
            price: parseInt(price) || '0'
          }
        })
      : await mutateUpdateTask({
          variables: {
            id,
            content,
            price_total: parseInt(price_total) || '0',
            price: parseInt(price) || '0',
            status
          }
        });
    setChangeLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await mutateDeleteTask({
      variables: { id }
    });
    setDeleteLoading(false);
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
      <TaskHeader
        status={status}
        price_total={price_total}
        price={price}
        changeLoading={changeLoading}
        deleteLoading={deleteLoading}
        disabled={disabled}
        isCreate={isCreate}
        onStatus={handleStatus}
        onPriceTotal={handlePriceTotal}
        onPrice={handlePrice}
        onSave={handleSave}
        onDelete={handleDelete}
        onEnabled={() => setDisabled(false)}
        onClose={onClose}
      />
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
