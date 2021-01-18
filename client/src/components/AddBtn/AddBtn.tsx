import React, { useState, FC, ReactChild } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import {
  Tooltip,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import CircleLoading from "../CircleLoading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 1000,
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    progressBtn: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
      color: green[500],
    },
  })
);

interface AddBtnProps {
  title: string;
  onSave(): void;
  loading: boolean;
  disabled?: boolean;
  children?: ReactChild;
}

const AddBtn: FC<AddBtnProps> = ({
  title,
  onSave,
  loading,
  disabled = false,
  children,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSave = () => {
    onSave();
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={title} placement="left">
        <Fab
          color="secondary"
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
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <CircleLoading size={24} isLoading={loading}>
            <Button
              onClick={handleSave}
              color="primary"
              disabled={disabled || loading}
            >
              Подтвердить
            </Button>
          </CircleLoading>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AddBtn;
