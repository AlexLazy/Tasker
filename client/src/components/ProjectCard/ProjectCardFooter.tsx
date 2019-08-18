import React, { FC, Fragment, useState } from 'react';

import { ExecutionResult, MutationFunctionOptions } from '@apollo/react-common';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteBtn: {
      marginLeft: 'auto'
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    progressBtn: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
      color: green[500]
    }
  })
);

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
}

const ProjectCardFooter: FC<ProjectCardFooterProps> = ({
  id,
  mutateDeleteProject,
  loadingDeleteProject
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
        <IconButton aria-label='Добавить пользователя к проекту'>
          <PersonAddIcon />
        </IconButton>
        <IconButton aria-label='Удалить пользователя с проекта'>
          <PersonAddDisabledIcon />
        </IconButton>
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
          <div className={classes.wrapper}>
            <Button
              onClick={handleDeleteProject}
              color='primary'
              disabled={loadingDeleteProject}
            >
              Да
            </Button>
            {loadingDeleteProject && (
              <CircularProgress className={classes.progressBtn} size={24} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default ProjectCardFooter;
