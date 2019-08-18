import React, { FC, Fragment, useState, ReactChild } from 'react';

import { ExecutionResult, MutationFunctionOptions } from '@apollo/react-common';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 1000
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
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

interface AddBtn {
  title: string;
  reguest(
    options?: MutationFunctionOptions<any, any> | undefined
  ): Promise<void | ExecutionResult<any>>;
  loading: boolean;
  variables?: { [key: string]: any };
  children?: ReactChild;
}

const AddBtn: FC<AddBtn> = ({
  title,
  reguest,
  loading,
  variables,
  children
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteProject = async () => {
    variables ? await reguest({ variables }) : await reguest();
    !loading && setOpen(false);
  };

  return (
    <Fragment>
      <Tooltip title={title} placement='left'>
        <Fab
          color='secondary'
          aria-label={title}
          className={classes.btn}
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Отмена
          </Button>
          <div className={classes.wrapper}>
            <Button
              onClick={handleDeleteProject}
              color='primary'
              disabled={loading}
            >
              Подтвердить
            </Button>
            {loading && (
              <CircularProgress className={classes.progressBtn} size={24} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default AddBtn;
