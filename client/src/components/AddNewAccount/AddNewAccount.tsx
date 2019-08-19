import React, { FC, useState } from 'react';

import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { CREATE_USER } from '../../gql/mutations';
import { IS_NEW_ACCOUNT_OPEN } from '../../gql/queries';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import CircleLoading from '../CircleLoading';

const AddNewAccount: FC = () => {
  const client = useApolloClient();
  const [email, setEmail] = useState('');
  const { data } = useQuery(IS_NEW_ACCOUNT_OPEN);
  const { isNewAccountOpen } = data;
  const [mutateCreateUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted({ createUser }) {
      client.writeData({
        data: {
          error: {
            __typename: 'error',
            text: createUser
              ? `Пользователь ${
                  createUser.email
                } успешно добавлен. Для активации аккаунта он должен залогиниться.`
              : 'Произошла ошибка',
            open: true
          }
        }
      });
    },
    onError(error) {
      client.writeData({
        data: {
          error: {
            __typename: 'error',
            text: error.message,
            open: true
          }
        }
      });
    }
  });

  const handleClose = () => {
    setEmail('');
    client.writeData({
      data: {
        isNewAccountOpen: false
      }
    });
  };

  const handleCreateUser = async () => {
    await mutateCreateUser({ variables: { email } });
    setEmail('');
    client.writeData({
      data: {
        isNewAccountOpen: false
      }
    });
  };

  return (
    <Dialog
      open={isNewAccountOpen || false}
      onClose={handleClose}
      fullWidth
      aria-labelledby='add-user-dialog-title'
    >
      <DialogTitle id='add-user-dialog-title'>
        Добавить нового пользователя в систему
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Название проекта'
          type='email'
          fullWidth
          onChange={e => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Отмена
        </Button>
        <CircleLoading size={24} isLoading={loading}>
          <Button
            onClick={handleCreateUser}
            color='primary'
            disabled={!email || loading}
          >
            Подтвердить
          </Button>
        </CircleLoading>
      </DialogActions>
    </Dialog>
  );
};
export default AddNewAccount;
