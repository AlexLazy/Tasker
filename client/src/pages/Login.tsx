import React, { FC, useState, ChangeEvent } from 'react';

import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { LOGIN, CREATE_ADMIN } from '../gql/mutations';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline
} from 'react-google-login';

import FullPageLoading from '../components/FullPageLoading';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    zIndex: 2
  },
  btn: {
    marginBottom: 16
  }
});

const Login: FC = () => {
  const classes = useStyles();
  const client = useApolloClient();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [role, setRole] = useState(false);

  const [login, { loading }] = useMutation<{ login: string }>(LOGIN, {
    onCompleted({ login }) {
      if (login === 'User not found') {
        client.writeData({
          data: {
            error: {
              __typename: 'error',
              text: 'Такого пользователя не существует.',
              open: true
            }
          }
        });
      } else {
        localStorage.setItem('token', 'Bearer ' + login);
        document.location.reload();
      }
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

  //Временная часть для демонстрации, в конечном варианте возможности создавать админа с клиента не планируется
  const [loginAdmin, { loading: loadingAdmin }] = useMutation<{
    createAdmin: string;
  }>(CREATE_ADMIN, {
    onCompleted({ createAdmin }) {
      if (!createAdmin) {
        client.writeData({
          data: {
            error: {
              __typename: 'error',
              text: 'Произошла ошибка.',
              open: true
            }
          }
        });
      } else {
        localStorage.setItem('token', 'Bearer ' + createAdmin);
        document.location.reload();
      }
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

  const responseGoogle = (login: Function) => (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const { id_token } = (response as GoogleLoginResponse).getAuthResponse();
    const options = {
      variables: {
        id_token
      }
    };

    role ? loginAdmin(options) : login(options);
  };

  const handleRole = (e: ChangeEvent<HTMLInputElement>) =>
    setRole(e.target.checked);

  return (
    <FullPageLoading>
      {!loading && !loadingAdmin && clientId && (
        <section className={classes.root}>
          <GoogleLogin
            className={classes.btn}
            clientId={clientId}
            buttonText='Login'
            onSuccess={responseGoogle(login)}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <Grid component='label' container alignItems='center' spacing={1}>
            <Grid item>Разработчик</Grid>
            <Grid item>
              <Switch checked={role} onChange={handleRole} value='antoine' />
            </Grid>
            <Grid item>Администратор</Grid>
          </Grid>
        </section>
      )}
    </FullPageLoading>
  );
};

export default Login;
