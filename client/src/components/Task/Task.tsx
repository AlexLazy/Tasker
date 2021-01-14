import React, { FC, useState, forwardRef, useEffect } from "react";
import { ApolloQueryResult, gql, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import { Slide, Dialog, Container } from "@material-ui/core";
import { meVar } from "../../cache";
import TaskHeader from "./TaskHeader";
import Editor from "../Editor";

export enum TaskStatus {
  OPENED = "OPENED",
  CHECKING = "CHECKING",
  CLOSED = "CLOSED",
}

export interface NewTask {
  priceTotal: number;
  price: number;
  content: string;
  status: TaskStatus;
}

export interface Task extends NewTask {
  id?: number;
  authorId?: number;
  updatedAt?: Date;
}

interface TaskProps {
  projectId?: number;
  task: Task | null;
  open: boolean;
  refetch(
    variables?: Partial<Record<string, any>> | undefined
  ): Promise<ApolloQueryResult<any>>;
  onClose(): void;
}

const ADD_TASK = gql`
  mutation AddTask(
    $projectId: ID!
    $content: String!
    $price: Int
    $priceTotal: Int
  ) {
    addTask(
      projectId: $projectId
      content: $content
      price: $price
      priceTotal: $priceTotal
    ) {
      message
      task {
        id
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $content: String!
    $price: Int!
    $priceTotal: Int!
    $status: TaskStatus!
  ) {
    updateTask(
      id: $id
      content: $content
      price: $price
      priceTotal: $priceTotal
      status: $status
    ) {
      message
      task {
        id
      }
    }
  }
`;

const REMOVE_TASK = gql`
  mutation RemoveTask($id: ID!) {
    removeTask(id: $id) {
      message
      task {
        id
      }
    }
  }
`;

const useStyles = makeStyles({
  container: {
    height: "100%",
  },
});

const Transition = forwardRef<
  unknown,
  TransitionProps & {
    children?: React.ReactElement;
  }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const TaskComponent: FC<TaskProps> = ({
  projectId,
  task,
  open,
  refetch,
  onClose,
}) => {
  const classes = useStyles();
  const { id } = meVar();
  const [height, setHeight] = useState(0);
  const [content, setContent] = useState("");
  const [addTask, { loading: addLoading }] = useMutation(ADD_TASK);
  const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK);
  const [removeTask, { loading: deleteLoading }] = useMutation(REMOVE_TASK);

  useEffect(() => {
    task && setContent(task.content);
    return () => setContent("");
  }, [open, task]);

  const handleContent = (content: string) => setContent(content);

  const handleSave = async (task: Task) => {
    task.id
      ? await updateTask({ variables: { ...task, content } })
      : await addTask({ variables: { ...task, content, projectId } });
    onClose();
  };
  const handleDelete = async (task: Task) => {
    await removeTask({ variables: { id: task.id } });
    onClose();
  };

  const handleExited = () => refetch();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      onExited={handleExited}
      TransitionComponent={Transition}
      disableEnforceFocus
    >
      <TaskHeader
        owner={id === task?.authorId}
        task={task}
        changeLoading={addLoading || updateLoading}
        deleteLoading={deleteLoading}
        onSave={handleSave}
        onDelete={handleDelete}
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
          />
        ) : (
          <p>Загрузка</p>
        )}
      </Container>
    </Dialog>
  );
};
export default TaskComponent;
