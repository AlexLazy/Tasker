import React, { FC, Fragment, useState } from 'react';

import { ExecutionResult, MutationFunctionOptions } from '@apollo/react-common';

import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import ProjectCardUserAdd from './ProjectCardUserAdd';
import ProjectCardUserRemove from './ProjectCardUserRemove';
import CircleLoading from '../CircleLoading';

import { IUser } from './ProjectCard';

const useStyles = makeStyles({
  deleteBtn: {
    marginLeft: 'auto'
  }
});

export interface ProjectCardFooterProps {
  id: number;
  loadingDeleteProject: boolean;
  mutateDeleteProject(
    options?:
      | MutationFunctionOptions<
          any,
          {
            id: number;
          }
        >
      | undefined
  ): Promise<void | ExecutionResult<any>>;
  inProjectUsers: IUser[];
}

const ProjectCardFooter: FC<ProjectCardFooterProps> = ({
  id,
  mutateDeleteProject,
  loadingDeleteProject,
  inProjectUsers
}) => {
  const classes = useStyles();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteProjectClose = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteProject = async () => {
    await mutateDeleteProject({ variables: { id } });
    !loadingDeleteProject && setIsDeleteOpen(false);
  };

  return (
    <Fragment>
      <CardActions disableSpacing>
        <ProjectCardUserAdd id={id} inProjectUsers={inProjectUsers} />
        <ProjectCardUserRemove id={id} inProjectUsers={inProjectUsers} />
        <IconButton
          className={classes.deleteBtn}
          onClick={handleDelete}
          aria-label='Удалить проект'
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
      <Dialog
        open={isDeleteOpen}
        onClose={handleDeleteProjectClose}
        aria-labelledby='delete-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Удалить проект?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteProjectClose} color='primary' autoFocus>
            Нет
          </Button>
          <CircleLoading size={24} isLoading={loadingDeleteProject}>
            <Button
              onClick={handleDeleteProject}
              color='primary'
              disabled={loadingDeleteProject}
            >
              Да
            </Button>
          </CircleLoading>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default ProjectCardFooter;
