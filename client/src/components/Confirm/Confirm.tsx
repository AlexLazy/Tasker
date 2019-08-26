import React, { StatelessComponent } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircleLoading from '../CircleLoading';

interface ConfirmProps {
  title: string;
  open: boolean;
  isLoading: boolean;
  onClose(): void;
  onAccept(): void;
}

const Confirm: StatelessComponent<ConfirmProps> = ({
  title,
  open,
  isLoading,
  onClose,
  onAccept
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby='delete-dialog-title'
    aria-describedby='alert-dialog-description'
  >
    <DialogTitle id='delete-dialog-title'>{title}</DialogTitle>
    <DialogActions>
      <Button onClick={onClose} color='primary' autoFocus>
        Нет
      </Button>
      <CircleLoading size={24} isLoading={isLoading}>
        <Button onClick={onAccept} color='primary' disabled={isLoading}>
          Да
        </Button>
      </CircleLoading>
    </DialogActions>
  </Dialog>
);
export default Confirm;
