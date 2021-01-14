import React, { FC } from "react";
import { Dialog, DialogActions, DialogTitle, Button } from "@material-ui/core";
import CircleLoading from "../CircleLoading";

interface ConfirmProps {
  title: string;
  open: boolean;
  isLoading: boolean;
  onClose(): void;
  onAccept(): void;
}

const Confirm: FC<ConfirmProps> = ({
  title,
  open,
  isLoading,
  onClose,
  onAccept,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="delete-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
    <DialogActions>
      <Button onClick={onClose} color="primary" autoFocus>
        Нет
      </Button>
      <CircleLoading size={24} isLoading={isLoading}>
        <Button onClick={onAccept} color="primary" disabled={isLoading}>
          Да
        </Button>
      </CircleLoading>
    </DialogActions>
  </Dialog>
);
export default Confirm;
