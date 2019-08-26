import React, { FC, Fragment, useState } from 'react';

import { ExecutionResult, MutationFunctionOptions } from '@apollo/react-common';

import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import ProjectCardUserAdd from './ProjectCardUserAdd';
import ProjectCardUserRemove from './ProjectCardUserRemove';
import Confirm from '../Confirm';

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
  const [open, setOpen] = useState(false);

  const handleDeleteProject = async () => {
    await mutateDeleteProject({ variables: { id } });
    !loadingDeleteProject && setOpen(false);
  };

  return (
    <Fragment>
      <CardActions disableSpacing>
        <ProjectCardUserAdd id={id} inProjectUsers={inProjectUsers} />
        <ProjectCardUserRemove id={id} inProjectUsers={inProjectUsers} />
        <IconButton
          className={classes.deleteBtn}
          onClick={() => setOpen(true)}
          aria-label='Удалить проект'
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
      <Confirm
        title='Удалить проект?'
        isLoading={loadingDeleteProject}
        open={open}
        onClose={() => setOpen(false)}
        onAccept={handleDeleteProject}
      />
    </Fragment>
  );
};
export default ProjectCardFooter;
